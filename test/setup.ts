import ReactObj from 'react';
import ReactDOMObj from 'react-dom';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';

global['React'] = ReactObj;
global['ReactDOM'] = ReactDOMObj;
global['chai'] = chai;
global['expect'] = chai.expect;

enzyme.configure({ adapter: new Adapter() });