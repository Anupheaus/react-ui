import { FunctionComponent, ReactElement, useState } from 'react';
import { mount } from 'enzyme';
import { useApi } from './useApi';
import moxios from '@anilanar/moxios';
import { ExceptWhenDelegate, IUseApiResponse, CancelRequest, ForceRequest } from './models';

describe('useApi', () => {

  [
    { method: 'get', requestUrl: '/testGet', requestData: undefined },
    { method: 'post', requestUrl: '/testPost', requestData: { postedData: 'hey' } },
    { method: 'put', requestUrl: '/testPut', requestData: { postedData: 'hey' } },
    { method: 'patch', requestUrl: '/testPatch', requestData: { postedData: 'hey' } },
    { method: 'delete', requestUrl: '/testDelete', requestData: { postedData: 'hey' } },
  ].forEach(({ method, requestUrl, requestData }) => {

    describe(method, () => {

      interface IProps {
        dependencies?: ReadonlyArray<any>;
        exceptWhen?: ExceptWhenDelegate<any>;
        ignoredProp?: string;
        onRender?(): void;
        children(response: IUseApiResponse<any>): ReactElement;
      }

      interface IState {
        data: any;
        error: Error;
      }

      const TestDirectComponent: FunctionComponent<IProps> = ({ onRender, dependencies = Array.empty(), exceptWhen = () => false, children }) => {
        if (onRender) { onRender(); }

        const { data, error, cancelRequest, forceRequest, promise } = useApi
          .observe(dependencies)
          .exceptWhen(exceptWhen)
        [method](requestUrl, requestData)
          .end;

        return children({ data, error, cancelRequest, forceRequest, promise });
      };

      const TestThenAndCatchComponent: FunctionComponent<IProps> = ({ onRender, dependencies = Array.empty(), exceptWhen = () => false, children }) => {
        const [{ data, error }, setState] = useState<IState>({ data: undefined, error: undefined });
        if (onRender) { onRender(); }

        const { cancelRequest, forceRequest, promise } = useApi
          .observe(dependencies)
          .exceptWhen(exceptWhen)
        [method](requestUrl, requestData)
          .then((d: any) => setState(s => ({ ...s, data: d })))
          .catch((e: Error) => setState(s => ({ ...s, error: e })))
          .end;

        return children({ data, error, cancelRequest, forceRequest, promise });
      };

      async function respondWith(response: Parameters<ReturnType<typeof moxios.requests.mostRecent>['respondWith']>[0]) {
        const request = moxios.requests.mostRecent();
        await request.respondWith(response);
      }

      function confirmRequest() {
        const request = moxios.requests.mostRecent();
        if (!request) { expect.fail('The request was to be confirmed by the test but no request was found.'); }
        expect(request['config'].method).to.eq(method);
        expect(request['config'].url).to.eq(requestUrl);
        if (requestData) { expect(JSON.parse(request['config'].data)).to.eql(requestData); }
      }

      beforeEach(() => {
        moxios.install();
      });

      afterEach(() => {
        moxios.uninstall();
      });

      [
        { Component: TestDirectComponent, title: 'Direct' },
        { Component: TestThenAndCatchComponent, title: 'Then and Catch' },
      ]
        .forEach(({ Component, title }) => {

          describe(title, () => {

            it('returns everything it is supposed to', () => {
              let data: any;
              let error: Error;
              let cancelRequest: (reason?: string) => void;
              let forceRequest: () => void;
              let promise: Promise<any>;

              const component = mount((
                <Component>
                  {({ data: innerData, error: innerError, cancelRequest: innerCancel, forceRequest: innerForce, promise: innerPromise }) => {
                    data = innerData;
                    error = innerError;
                    cancelRequest = innerCancel;
                    forceRequest = innerForce;
                    promise = innerPromise;
                    return null;
                  }}
                </Component>
              ));

              expect(data).to.be.undefined;
              expect(error).to.be.undefined;
              expect(cancelRequest).to.be.a('function');
              expect(forceRequest).to.be.a('function');
              expect(promise).to.be.instanceOf(Promise);

              component.unmount();
            });

            it('can make a simple request on mounting of a component', async () => {
              let renderCount = 0;
              let data: any;
              let error: Error;

              const component = mount((
                <Component onRender={() => { renderCount++; }}>
                  {({ data: innerData, error: innerError }) => {
                    data = innerData;
                    error = innerError;
                    return null;
                  }}
                </Component>
              ));

              expect(renderCount).to.eq(1);
              expect(data).to.be.undefined;
              expect(error).to.be.undefined;

              await moxios.wait();
              confirmRequest();
              await respondWith({ status: 200, response: { something: 'else' } });

              expect(renderCount).to.eq(2);
              expect(data).to.be.eql({ something: 'else' });
              expect(error).to.be.undefined;

              component.unmount();
            });

            it('makes another request when the dependencies change', async () => {
              let renderCount = 0;
              let data: any;
              let error: Error;

              const component = mount((
                <Component onRender={() => { renderCount++; }} dependencies={[{ hey: 'test' }]}>
                  {({ data: innerData, error: innerError }) => {
                    data = innerData;
                    error = innerError;
                    return null;
                  }}
                </Component>
              ));

              expect(renderCount).to.eq(1);
              expect(data).to.be.undefined;
              expect(error).to.be.undefined;

              await moxios.wait();
              confirmRequest();
              await respondWith({ status: 200, response: { something: 'else' } });

              expect(renderCount).to.eq(2);
              expect(data).to.be.eql({ something: 'else' });
              expect(error).to.be.undefined;

              component.setProps({ dependencies: [{ hey: 'now' }] });

              expect(renderCount).to.eq(3); // because the change in props now forced a render

              await moxios.wait();
              confirmRequest();
              await respondWith({ status: 200, response: { something: 'more' } });
              expect(renderCount).to.eq(4);
              expect(data).to.be.eql({ something: 'more' });
              expect(error).to.be.undefined;

              component.unmount();
            });

            it('does not make another request when the dependencies don\'t change', async () => {
              let renderCount = 0;
              let data: any;
              let error: Error;

              const component = mount((
                <Component onRender={() => { renderCount++; }} dependencies={[{ hey: 'test' }]} ignoredProp="hey">
                  {({ data: innerData, error: innerError }) => {
                    data = innerData;
                    error = innerError;
                    return null;
                  }}
                </Component>
              ));

              expect(renderCount).to.eq(1);
              expect(data).to.be.undefined;
              expect(error).to.be.undefined;

              await moxios.wait();
              confirmRequest();
              await respondWith({ status: 200, response: { something: 'else' } });
              moxios.requests.reset();

              expect(renderCount).to.eq(2);
              expect(data).to.be.eql({ something: 'else' });
              expect(error).to.be.undefined;

              component.setProps({ ignoredProp: 'now' });

              expect(renderCount).to.eq(3); // because the change in props now forced a render

              await moxios.wait();
              expect(moxios.requests.mostRecent()).to.be.undefined;

              expect(renderCount).to.eq(3);
              expect(data).to.be.eql({ something: 'else' });
              expect(error).to.be.undefined;

              component.unmount();
            });

            it('is successfully prevented from making another request when exceptWhen is used', async () => {
              let renderCount = 0;
              let data: any;
              let error: Error;

              const component = mount((
                <Component onRender={() => { renderCount++; }} dependencies={[{ hey: 'test' }]} exceptWhen={(([{ hey }]) => hey === 'now')}>
                  {({ data: innerData, error: innerError }) => {
                    data = innerData;
                    error = innerError;
                    return null;
                  }}
                </Component>
              ));

              expect(renderCount).to.eq(1);
              expect(data).to.be.undefined;
              expect(error).to.be.undefined;

              await moxios.wait();
              confirmRequest();
              await respondWith({ status: 200, response: { something: 'else' } });
              moxios.requests.reset();

              expect(renderCount).to.eq(2);
              expect(data).to.be.eql({ something: 'else' });
              expect(error).to.be.undefined;

              component.setProps({ dependencies: [{ hey: 'now' }] });

              expect(renderCount).to.eq(3); // because the change in props now forced a render

              await moxios.wait();
              expect(moxios.requests.mostRecent()).is.undefined;

              expect(renderCount).to.eq(3); // no change here because the request was prevented
              expect(data).to.be.eql({ something: 'else' });
              expect(error).to.be.undefined;

              component.unmount();
            });

            it('is can be cancelled successfully before making any requests', async () => {
              let renderCount = 0;
              let data: any;
              let error: Error;
              let cancelRequest: CancelRequest;

              const component = mount((
                <Component onRender={() => { renderCount++; }}>
                  {({ data: innerData, error: innerError, cancelRequest: innerCancel }) => {
                    data = innerData;
                    error = innerError;
                    cancelRequest = innerCancel;
                    return null;
                  }}
                </Component>
              ));

              expect(renderCount).to.eq(1);
              expect(data).to.be.undefined;
              expect(error).to.be.undefined;
              expect(cancelRequest).to.be.a('function');

              cancelRequest('my reason');

              await moxios.wait();
              expect(moxios.requests.mostRecent()).to.be.undefined;

              component.unmount();
            });

            it('can be cancelled successfully after making a request', async () => {
              let renderCount = 0;
              let data: any;
              let error: Error;
              let cancelRequest: CancelRequest;

              const component = mount((
                <Component onRender={() => { renderCount++; }}>
                  {({ data: innerData, error: innerError, cancelRequest: innerCancel }) => {
                    data = innerData;
                    error = innerError;
                    cancelRequest = innerCancel;
                    return null;
                  }}
                </Component>
              ));

              expect(renderCount).to.eq(1);
              expect(data).to.be.undefined;
              expect(error).to.be.undefined;
              expect(cancelRequest).to.be.a('function');

              await moxios.wait(); // so we have a response waiting in the queue
              confirmRequest();
              cancelRequest('my reason'); // cancel the response
              await respondWith({ status: 200, response: { something: 'more' } }); // return a response

              expect(renderCount).to.eq(1); // even though a response was returned, the request was cancelled, so no update occurred

              component.unmount();
            });

            it('can be forced to re-request', async () => {
              let renderCount = 0;
              let data: any;
              let error: Error;
              let forceRequest: ForceRequest;

              const component = mount((
                <Component onRender={() => { renderCount++; }}>
                  {({ data: innerData, error: innerError, forceRequest: innerForce }) => {
                    data = innerData;
                    error = innerError;
                    forceRequest = innerForce;
                    return null;
                  }}
                </Component>
              ));

              expect(renderCount).to.eq(1);
              expect(data).to.be.undefined;
              expect(error).to.be.undefined;
              expect(forceRequest).to.be.a('function');

              await moxios.wait();
              confirmRequest();
              await respondWith({ status: 200, response: { something: 'more' } });

              expect(renderCount).to.eq(2);

              forceRequest(); // force a re-request

              await moxios.wait();
              await respondWith({ status: 200, response: { something: 'else' } });

              expect(renderCount).to.eq(3); // we should have rendered again because of the force

              component.unmount();
            });

            it('can be cancelled then the dependencies change and it successfully re-requests', async () => {
              let renderCount = 0;
              let data: any;
              let error: Error;
              let cancelRequest: CancelRequest;

              const component = mount((
                <Component onRender={() => { renderCount++; }} dependencies={[{ hey: 'test' }]}>
                  {({ data: innerData, error: innerError, cancelRequest: innerCancel }) => {
                    data = innerData;
                    error = innerError;
                    cancelRequest = innerCancel;
                    return null;
                  }}
                </Component>
              ));

              expect(renderCount).to.eq(1);
              expect(data).to.be.undefined;
              expect(error).to.be.undefined;
              expect(cancelRequest).to.be.a('function');

              expect(renderCount).to.eq(1); // we cancelled the request

              await moxios.wait();
              confirmRequest();

              cancelRequest('my reason');

              await respondWith({ status: 200, response: { something: 'else' } });

              await Promise.delay(10);

              expect(data).to.be.undefined;

              component.setProps({ dependencies: [{ hey: 'now' }] });

              expect(renderCount).to.eq(2); // we should have rendered again because of the props changing

              expect(data).to.be.undefined;

              await moxios.wait();
              confirmRequest();
              await respondWith({ status: 200, response: { something: 'more' } });

              expect(renderCount).to.eq(3); // we should have rendered again because of the resulting api call off the back of the dependencies being changed

              expect(data).to.eql({ something: 'more' });

              component.unmount();
            });

            [
              { code: 200, isSuccess: true },
              { code: 201, isSuccess: true },
              { code: 202, isSuccess: true },
              { code: 400, isSuccess: false },
              { code: 404, isSuccess: false },
              { code: 500, isSuccess: false },
            ].forEach(({ code, isSuccess }) => {

              it(`handles status code ${code}`, async () => {
                let renderCount = 0;
                let data: any;
                let error: Error;
                let forceRequest: ForceRequest;
                let promise: Promise<any>;

                const component = mount((
                  <Component onRender={() => { renderCount++; }}>
                    {({ data: innerData, error: innerError, forceRequest: innerForce, promise: innerPromise }) => {
                      data = innerData;
                      error = innerError;
                      forceRequest = innerForce;
                      promise = innerPromise;
                      return null;
                    }}
                  </Component>
                ));

                expect(renderCount).to.eq(1);
                expect(data).to.be.undefined;
                expect(error).to.be.undefined;
                expect(forceRequest).to.be.a('function');
                expect(promise).to.be.instanceOf(Promise);

                await moxios.wait();
                confirmRequest();
                await respondWith({ status: code, response: { something: 'more' } });

                expect(renderCount).to.eq(2);
                if (isSuccess) {
                  expect(data).to.be.eql({ something: 'more' });
                  expect(error).to.be.undefined;
                } else {
                  expect(data).to.be.undefined;
                  expect(error).to.have.property('message', `Request failed with status code ${code}`);
                }

                component.unmount();
              });

            });

          });

        });

    });

  });

});
