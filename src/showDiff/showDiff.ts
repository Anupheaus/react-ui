// // tslint:disable:no-console
// import 'anux-common';
// import { AnyObject } from 'anux-common';
// import moment from 'moment';

// const styles = {
//   '%cl': 'color:grey;text-decoration:none;',
//   '%gr': 'color:green;text-decoration:none;',
//   '%rs': 'color:red;text-decoration:line-through;',
// };

// function addIndent(indent: number): string {
//   return ' '.repeat(indent * 2);
// }

// function log(indent: number, line: string): string {
//   return `%cl${addIndent(indent)}${line}`;
// }

// function formatValue(indent: number, info: Reflect.TypeOf): string {
//   if (info.isNull) {
//     return 'null';
//   } else if (info.isUndefined) {
//     return 'undefined';
//   } else if (info.isObject) {
//     const keys = Object.keys(info.value).sort().map(key => `${addIndent(indent + 1)}${key}: ${formatValue(indent + 1, Reflect.typeOf(info.value[key]))}`);
//     return `{${keys.length > 0 ? '\n' : ''}${keys}${keys.length > 0 ? ',\n' : ''}${addIndent(keys.length > 0 ? indent : 0)}}`;
//   } else if (info.isArray) {
//     return `[\n${(info.value as []).map((val, index) => `${addIndent(indent + 1)}${index}: ${formatValue(indent + 1, Reflect.typeOf(val))},`)}\n${addIndent(indent)}]`;
//   } else if (info.isString) {
//     return `'${info.value}'`;
//   } else if (info.isDate) {
//     return `${Date.format(info.value as unknown as number)} ${(info.value as Date).getMilliseconds()}`;
//   } else if (info.isInstance) {
//     return `[Instance: ${info.value.constructor.name}]`;
//   } else if (info.isFunction) {
//     let functionString = info.value.toString().replace(/\n/g, '').replace(/\s{2,}/g, ' ');
//     if (functionString.length > 50) { functionString = `${functionString.substr(0, 25)}...${functionString.substr(functionString.length - 25)}`; }
//     return `[${functionString}]`;
//   } else if (info.isPrototype) {
//     return `[Type: ${(info.value as Function).name}]`;
//   } else {
//     return info.value.toString();
//   }
// }

// function diffArray(indent: number, infoA: Reflect.TypeOf<unknown[]>, infoB: Reflect.TypeOf<unknown[]>): string {
//   const max = Math.max(infoA.value.length, infoB.value.length);
//   const compareValues = (index: number) => {
//     const valA = index < infoA.value.length ? Reflect.typeOf(infoA.value[index]) : null;
//     const valB = index < infoB.value.length ? Reflect.typeOf(infoB.value[index]) : null;
//     if (valA == null && valB != null && valB.isUndefined) {
//       return '%grundefined%cl';
//     } else if (valB == null && valA != null && valA.isUndefined) {
//       return '%rsundefined%cl';
//     } else {
//       // eslint-disable-next-line @typescript-eslint/no-use-before-define
//       return diffValues(indent + 1, Reflect.typeOf(infoA.value[index] as object), Reflect.typeOf(infoB.value[index] as object));
//     }
//   };
//   return [
//     log(indent, '[\n'),
//     Array.ofSize(max)
//       .map((_ignore, index) => log(indent + 1, `${index}: ${compareValues(index)},\n`))
//       .join(''),
//     log(indent, ']'),
//   ].join('');
// }

// function diffReactElement(indent: number, infoA: Reflect.TypeOf<React.ReactElement<any>>, infoB: Reflect.TypeOf<React.ReactElement<any>>): string {
//   const elementA = (({ type, key, props }) => ({ type, key, props }))(infoA.value);
//   const elementB = (({ type, key, props }) => ({ type, key, props }))(infoB.value);

//   // eslint-disable-next-line @typescript-eslint/no-use-before-define
//   return diffObject(indent, Reflect.typeOf(elementA), Reflect.typeOf(elementB), false);
// }

// function diffNonMatching(indent: number, infoA: Reflect.TypeOf, infoB: Reflect.TypeOf): string {
//   if (infoA.value === infoB.value) {
//     return formatValue(indent, infoA);
//   } else if (infoA.isDate && infoB.isDate) {
//     if ((infoA.value as Date).getTime() === (infoB.value as Date).getTime()) { return formatValue(indent, infoA); }
//     const dateA = moment(infoA.value);
//     const dateB = moment(infoB.value);
//     const diff = dateB.diff(dateA);
//     const duration = moment.duration(diff);
//     return `%rs${formatValue(indent, infoA)} %gr${formatValue(indent, infoB)} (difference: ${Math.floor(duration.asHours()).toString().padStart(3, '0')}` +
//       `:${moment.utc(diff).format('mm:ss SSS')})`;
//   } else if (infoA.isUndefined && !infoB.isUndefined) {
//     return `%gr${formatValue(indent, infoB)}`;
//   } else if (!infoA.isUndefined && infoB.isUndefined) {
//     return `%rs${formatValue(indent, infoA)}`;
//   } else {
//     return `%rs${formatValue(indent, infoA)} %gr${formatValue(indent, infoB)}`;
//   }
// }

// function diffObject(indent: number, infoA: Reflect.TypeOf, infoB: Reflect.TypeOf, sortKeys = true): string {
//   const keysA = Object.keys(infoA.value);
//   const keysB = Object.keys(infoB.value);
//   let combinedKeys = keysA.concat(keysB).distinct();
//   if (sortKeys) { combinedKeys = combinedKeys.sort(); }
//   return [
//     log(0, '{\n'),
//     ...combinedKeys
//       .map(key => log(indent + 1, `${key}: ${diffValues(indent + 1, Reflect.typeOf((infoA.value as AnyObject)[key]), Reflect.typeOf((infoB.value as AnyObject)[key]))},\n`)),
//     log(indent, '}'),
//   ].join('');
// }

// function diffPrototype(infoA: Reflect.TypeOf, infoB: Reflect.TypeOf): string {
//   if ((infoA.value as Function).name === (infoB.value as Function).name) {
//     return formatValue(0, infoA);
//   } else {
//     return `%rs${formatValue(0, infoA)} %gr${formatValue(0, infoB)}`;
//   }
// }

// function diffInstance(infoA: Reflect.TypeOf, infoB: Reflect.TypeOf): string {
//   if (infoA.value === infoB.value) {
//     return formatValue(0, infoA);
//   } else {
//     return `%rs${formatValue(0, infoA)} %gr${formatValue(0, infoB)}`;
//   }
// }

// function diffFunction(infoA: Reflect.TypeOf<Function>, infoB: Reflect.TypeOf<Function>): string {
//   if (infoA.value === infoB.value) {
//     return formatValue(0, infoA);
//   } else {
//     return `%rs${formatValue(0, infoA)} %gr${formatValue(0, infoB)}`;
//   }
// }

// function diffValues(indent: number, infoA: Reflect.TypeOf, infoB: Reflect.TypeOf): string {
//   if (infoA.type === infoB.type && !infoA.isNullOrUndefined) {
//     if (infoA.isArray) { return diffArray(indent, infoA, infoB); }
//     if (infoA.isPrototype) { return diffPrototype(infoA, infoB); }
//     if (infoA.isInstance) { return diffInstance(infoA, infoB); }
//     if (infoA.isReactElement) { return diffReactElement(indent, infoA, infoB); }
//     if (infoA.isObject) { return diffObject(indent, infoA, infoB); }
//     if (infoA.isFunction) { return diffFunction(infoA, infoB); }
//   }
//   return diffNonMatching(indent, infoA, infoB);
// }

// export function showDiff(valueA: any, valueB: any): void {

//   const report = diffValues(0, Reflect.typeOf(valueA), Reflect.typeOf(valueB));

//   report.split('\n').forEach(line => {
//     let codeIndex = 0;
//     const args: string[] = [];
//     do {
//       const next = Object.keys(styles)
//         .map(code => ({ index: line.indexOf(code, codeIndex), code }))
//         .filter(item => item.index !== -1)
//         .orderBy(item => item.index)
//         .firstOrDefault();
//       codeIndex = next == null ? line.length : next.index;
//       if (next) {
//         line = `${line.substr(0, codeIndex)}%c${line.substr(codeIndex + next.code.length)}`;
//         args.push(styles[next.code]);
//       }
//     } while (codeIndex < line.length);
//     console.log(line, ...args);
//   });

// }
