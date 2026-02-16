import type { Album } from "../../album/models/album";

export interface Photo {
  id: string;
  title: string;
  imageId: string;
  albums: Album[];
}
