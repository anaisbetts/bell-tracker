import { getValue, Model, when } from '@whenjs/when';
import { useEffect, useState } from 'react';
import { from, Observable } from 'rxjs';
import { Result } from './result';

export type PropSelector<TIn, TOut> = ((t: TIn) => TOut);

export function useObservable<T>(
  target: () => Observable<T>,
  initial?: T,
): Result<T | undefined> {
  const [ret, setter] = useState(Result.Ok(initial));
  const [obs] = useState(target);

  useEffect(
    () => {
      const sub = obs.subscribe(
        x => setter(Result.Ok(x)),
        ex => setter(Result.Err(ex)));

      return sub.unsubscribe.bind(sub);
    },
    [obs],
  );

  return ret;
}

export function usePromise<T>(
  target: () => Promise<T>,
  initial?: T,
): Result<T | undefined> {
  return useObservable(() => from(target()), initial);
}

export function useViewModel<T extends Model>(initial: () => T) {
  const [ret] = useState(initial);

  useEffect(
    () => {
      return ret.unsubscribe.bind(ret);
    },
    [ret],
  );

  return ret;
}

export function useWhen<TSource, TRet>(
  model: TSource,
  prop: PropSelector<TSource, TRet>,
): Result<TRet | undefined> {
  const initial = getValue(model, prop);
  const val = initial ? initial.value! : undefined;

  return useObservable(() => when(model, prop), val);
}
