export type MaxLengthArray<T> = {
  length: number;
  push: (value: T) => void;
  get: () => T[];
  clear: () => void;
  last: () => T | undefined;
};

export const MaxLengthArray = <T>(maxLength: number) => {
  const array: T[] = [];

  const mod: MaxLengthArray<T> = {
    length: 0,
    push: (value: T) => {
      if (array.length >= maxLength) {
        array.shift();
      }
      array.push(value);
      mod.length = array.length;
    },
    get: () => {
      return array;
    },
    clear: () => {
      array.length = 0;
      mod.length = 0;
    },
    last: () => {
      return array[array.length - 1];
    },
  };

  return mod;
};
