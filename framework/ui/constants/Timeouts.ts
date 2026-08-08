interface ITimeouts {
  readonly DEFAULT_DELAY: number;
  readonly EXPLICIT_WAIT: number;
  readonly WAIT_LOADER_APPEAR: number;
  readonly WAIT_LOADER_DISAPPEAR: number;
  readonly WAIT_PAGE_LOAD: number;
  readonly FILE_DOWNLOAD: number;
}

const Timeouts: ITimeouts = Object.freeze({
  DEFAULT_DELAY: 2000,
  EXPLICIT_WAIT: 10000,
  WAIT_LOADER_APPEAR: 1000,
  WAIT_LOADER_DISAPPEAR: 10000,
  WAIT_PAGE_LOAD: 30000,
  FILE_DOWNLOAD: 30000,
});

export default Timeouts;
