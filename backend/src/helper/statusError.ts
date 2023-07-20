class StatusError extends Error {
    status!: number;
    data: any;
  }

  export { StatusError };