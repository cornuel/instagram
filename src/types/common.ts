export interface IPoint {
  x: number
  y: number
}

export interface ISize {
  width: number
  height: number
}

export interface IAction {
  title: string
  classes?: any
  action?: () => void
}

export interface IPaginated {
  count: number
  next: string
  previous: string
}