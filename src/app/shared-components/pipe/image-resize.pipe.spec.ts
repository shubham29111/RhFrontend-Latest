import { ImageResizePipe } from './image-resize.pipe';

describe('ImageResizePipe', () => {
  it('create an instance', () => {
    const pipe = new ImageResizePipe();
    expect(pipe).toBeTruthy();
  });
});
