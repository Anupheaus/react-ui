import '@testing-library/jest-dom/vitest';
import { TextDecoder, TextEncoder } from 'util';
import React from 'react';
import ReactDOM from 'react-dom';

Object.assign(globalThis, { TextEncoder, TextDecoder, React, ReactDOM });
