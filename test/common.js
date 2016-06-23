export function testAsync(fn) {
  return async (done) => {
    try {
      await fn();
      done();
    } catch (err) {
      done(err);
    }
  };
}

export function returnValues(arr) {
  let i = 0;
  const nextVal = () => arr[i++];
  return nextVal;
}

export function returnValuesAsync(arr) {
  let i = 0;
  const nextVal = async () => arr[i++];
  return nextVal;
}
