export interface Socket {
  emit: (input: { channel: string; message: any }) => void
}