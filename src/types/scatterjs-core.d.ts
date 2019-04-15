// FIXME: ScatterJS Core don't have any typings
declare module 'scatterjs-core' {
  export default {
    Network: any,
    connect(pluginName: string, options?: any): Promise<boolean>
  }
}
