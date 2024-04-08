import { Meta, StoryObj } from '@storybook/react';
import { Scroller } from './Scroller';
import { Flex } from '../Flex';

const meta: Meta<typeof Scroller> = {
  component: Scroller,
};
export default meta;

type Story = StoryObj<typeof Scroller>;

export const config: Story = {
  storyName: '',
  args: {
  },
  render: props => {
    /* eslint-disable max-len */
    return (
      <Flex width={500} height={500}>
        <Scroller {...props}>
          <Flex width={1000}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet diam velit. Pellentesque lobortis at lectus eget tincidunt. Curabitur feugiat lacus a est tincidunt consequat. Nulla quis faucibus erat. Ut ex augue, aliquam sed lorem et, efficitur faucibus tortor. Duis pulvinar libero eu massa molestie bibendum. Etiam laoreet nibh nec porttitor fringilla. Nulla malesuada ut felis vitae pulvinar. Maecenas urna ex, pulvinar nec mattis quis, faucibus nec quam. Suspendisse semper, dui quis convallis eleifend, ante erat tempus velit, quis ullamcorper dolor eros et leo. Quisque dapibus fermentum aliquam. Donec dictum maximus leo, vitae sagittis nulla consequat non. Donec venenatis ipsum at tortor vestibulum egestas.

            Cras quis tempor elit, et scelerisque ipsum. Nunc consectetur neque dolor, eget venenatis nisl ultricies at. Nam eget urna pretium, placerat ipsum non, vehicula tellus. Vestibulum id suscipit enim, ut congue nulla. Cras dictum consectetur tellus et rhoncus. In in blandit justo, at iaculis dui. Pellentesque convallis vulputate libero ac facilisis.


            Donec eu libero ut risus vestibulum ornare. Vestibulum in orci ipsum. Suspendisse potenti. Praesent ut justo quam. Etiam augue metus, rutrum at purus id, imperdiet malesuada enim. Quisque ac neque dapibus, dictum tellus sed, suscipit magna. Aliquam erat volutpat.

            Quisque bibendum suscipit iaculis. Nullam turpis dolor, volutpat non nulla imperdiet, rutrum convallis tellus. Integer tincidunt nibh sit amet fringilla ornare. Cras at lorem ut leo varius egestas. Curabitur posuere lectus et vulputate posuere. Quisque aliquet purus eget nibh pretium elementum. Phasellus rutrum accumsan maximus. Donec consequat efficitur magna, dapibus blandit erat laoreet ut. Fusce mauris sem, faucibus quis malesuada a, consectetur at eros. Maecenas eu facilisis lectus, ac efficitur lectus. Quisque quis rutrum leo.

            Donec volutpat ligula vel lorem sagittis, nec mollis tortor pretium. Nam bibendum elementum accumsan. Curabitur maximus, ligula ut lacinia venenatis, mi ipsum viverra diam, vel finibus lacus diam quis mi. Nulla facilisi. Praesent eget lorem et felis interdum ultrices. Donec ac nisl ut ipsum suscipit euismod eu ut justo. Duis ac est et lectus dictum condimentum sed ac orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed eget ipsum magna. Proin laoreet ipsum eu felis sodales, eu pulvinar risus vehicula. Suspendisse non tincidunt leo. Nulla dictum purus vitae dolor condimentum euismod.

            Aenean at lacinia sem. Pellentesque sed nunc a neque consectetur congue vitae sed lacus. Donec cursus dignissim neque, nec tristique purus laoreet sit amet. Aenean ornare bibendum commodo. Ut auctor et velit nec mollis. Quisque molestie commodo tempus. Nulla massa massa, sodales id eleifend in, laoreet vitae sapien. Phasellus nisi dui, semper et ipsum vitae, rhoncus laoreet purus. Ut convallis odio vel orci ultrices egestas. Nunc vel orci congue, vulputate urna eget, laoreet magna. Vestibulum condimentum egestas erat, dictum elementum justo vestibulum vel.

            Morbi et lectus dignissim, dictum lorem non, malesuada eros. Nulla mollis odio a facilisis aliquet. Nam molestie, mi eu faucibus euismod, est erat condimentum quam, at malesuada nisi sapien id nisi. Duis eget metus mi. Vivamus in sem ut dui luctus pellentesque. Aliquam efficitur nisi et iaculis scelerisque. Integer fringilla vehicula enim, malesuada aliquam enim fermentum nec. Pellentesque eget tempor velit. Morbi aliquet pharetra mollis.

            Phasellus eu elementum dui, mattis lacinia lectus. Fusce commodo neque sit amet augue malesuada posuere at in libero. Vivamus nec malesuada eros. Aliquam vitae malesuada felis, at vulputate dui. Nam ut nulla in tortor pulvinar malesuada. Aenean ornare iaculis ante non finibus. Aliquam quis dui pellentesque justo luctus pharetra quis ac velit. Proin augue lacus, mollis quis nisi eu, lobortis eleifend nulla. Nulla viverra nunc et libero convallis fringilla. Etiam eget mollis neque.

            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla dapibus, nisl in congue egestas, justo lectus varius lorem, ut gravida nisi dui in sapien. Aenean blandit orci quam, at venenatis mauris vestibulum in. Pellentesque sit amet felis eget lacus placerat consequat id tempus turpis. Vestibulum ante nibh, porttitor eget risus sit amet, bibendum convallis nunc. Pellentesque eu maximus diam. Cras ac elit vitae purus vulputate ullamcorper et in libero. Integer at fringilla nibh, vitae convallis nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi et quam arcu. Nunc venenatis mauris non consectetur tincidunt. Mauris elit sem, viverra id dictum ac, vulputate a enim. Morbi eu luctus ligula. Donec gravida, felis semper hendrerit porttitor, velit elit tincidunt nisi, vel pharetra est metus eget purus. Suspendisse consequat sodales odio vitae gravida.

            Praesent ac mauris nec nibh egestas fringilla. Nam libero nibh, iaculis eu enim eget, molestie tristique turpis. Sed varius dapibus risus, eget varius augue iaculis vitae. Maecenas interdum lectus vel feugiat commodo. Fusce varius, ante sit amet lacinia porttitor, ipsum augue placerat nisi, sit amet euismod risus enim ac ligula. Suspendisse ultrices nisi est, sed interdum mi semper quis. Aliquam erat volutpat. Suspendisse augue eros, auctor eu nisl id, facilisis vehicula libero. Morbi feugiat tellus mauris, ac varius nisl blandit non. Donec vitae blandit orci. Integer tellus nisi, volutpat id felis vel, dictum ultrices eros. Donec id tristique nisl. Aliquam tristique arcu sit amet mi ultricies, et sodales lacus convallis. Vivamus turpis velit, ullamcorper pellentesque augue ut, malesuada placerat ex. Fusce nec ligula a arcu lobortis tincidunt.
          </Flex>
        </Scroller>
      </Flex>
    );
    /* eslint-enable max-len */
  },
} satisfies Story;
config.storyName = 'Default';
