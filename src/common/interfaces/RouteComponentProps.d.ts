// interface grapped from discord chanel
interface RouteComponentProps<ParamsOrKey extends string | Record<string, string> = string> {
  router: {
    location: Location;
    navigate: NavigateFunction;
    params: Readonly<[ParamsOrKey] extends [string] ? Params<ParamsOrKey> : Partial<ParamsOrKey>>;
  };
}
