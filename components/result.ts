export abstract class Result<T> {
  abstract isOk(): boolean;
  abstract isErr(): boolean;
  abstract ok(): T | undefined;
  abstract err(): Error | undefined;

  static Ok<T>(val: T): Result<T> {
    return new OkValue(val);
  }

  static Err<T>(err: Error): Result<T> {
    return new ErrorValue(err);
  }

  static fromPromise<T>(val: Promise<T>): Promise<Result<T>> {
    return val.then(
      x => Result.Ok(x),
      ex => Result.Err(ex));
  }

  expect(): T {
    if (this.isErr()) {
      throw new Error('Value is an Error and we expected an Ok');
    }

    return this.ok()!;
  }

  expectErr(): Error {
    if (this.isOk()) {
      throw new Error('Value is an Error and we expected an Ok');
    }

    return this.err()!;
  }

  contains(val: T): boolean {
    if (this.isErr()) return false;
    return (this.expect() === val);
  }

  map<N>(fn: ((val: T) => N)): Result<N> {
    if (this.isErr()) {
      return Result.Err<N>(this.expectErr());
    }

    return Result.Ok(fn(this.expect()));
  }

  mapOrElse<N>(orElse: N, fn: ((val: T) => N)): N {
    if (this.isErr()) return orElse;

    return fn(this.expect());
  }

  mapErr(fn: ((val: Error) => Error)): Result<T> {
    if (this.isOk()) return this;

    return Result.Err(fn(this.expectErr()));
  }

  and<N>(res: Result<N>): Result<N> {
    return this.isOk() ? res : Result.Err(this.expectErr());
  }

  andThen<N>(res: ((val: T) => Result<N>)): Result<N> {
    return this.isOk() ? res(this.expect()) : Result.Err(this.expectErr());
  }

  or(res: Result<T>): Result<T> {
    return this.isErr() ? res : this;
  }

  orElse(res: ((err: Error) => Result<T>)): Result<T> {
    return this.isErr() ? res(this.expectErr()) : this;
  }
}

class OkValue<T> extends Result<T> {
  value: T;

  constructor(val: T) {
    super();
    this.value = val;
  }

  isOk(): boolean {
    return true;
  }

  isErr(): boolean {
    return false;
  }

  ok(): T | undefined {
    return this.value;
  }

  err(): Error | undefined {
    return undefined;
  }
}

class ErrorValue<T> extends Result<T> {
  value: Error;

  constructor(val: Error) {
    super();
    this.value = val;
  }

  isOk(): boolean {
    return false;
  }

  isErr(): boolean {
    return true;
  }

  ok(): T | undefined {
    return undefined;
  }

  err(): Error | undefined {
    return this.value;
  }
}
