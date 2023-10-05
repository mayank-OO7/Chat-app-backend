export interface IMapper<A, B> {
  mapToB(a: A): B;
  mapToA(b: B): A;
}
