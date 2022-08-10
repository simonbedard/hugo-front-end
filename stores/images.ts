import { defineStore } from 'pinia'
import { shuffle } from '~/utils/arr';

export interface IImagesState {
  firstLoad: Boolean,
  images: Array<string>
  terms: string
  page: number
  isLoading: Boolean
  filters: any
}
export const useImages = defineStore('images', {
  state: (): IImagesState => ({
    firstLoad: true,
    images: [],
    terms: "",
    page: 1,
    isLoading: false,
    filters: {}
  }),

  getters: {
    chunks: (state) => {
      const threePartIndex = state.images.length / 4;
      const Images = state.images;
      const forstPart = Images.slice((threePartIndex*3), (threePartIndex*4));
      const thirdPart = Images.slice((threePartIndex*2), (threePartIndex*3));
      const secondPart = Images.slice(threePartIndex, ((threePartIndex*2)));
      const firstPart = Images.slice(0, threePartIndex);
      return [firstPart, thirdPart ,forstPart, secondPart];
    }
  },
  actions: {
    swap(update: Array<string>, terms: string, page: number) {
      this.images = update
      this.terms = terms;
      this.page = page;
      this.firstLoad = false;
    },
    append(update: Array<string>,page: number){
      this.page = page;
      this.images = [...this.images, ...update];
      this.firstLoad = false;
    },
    loading (bool: Boolean) {
      this.isLoading = bool;
    },

    async loadMore() {
        this.loading(true);
        
        const API_URL = `http://localhost:3012/api/v1/search/terms`
        const Url = `${API_URL}/${this.terms}/${this.page+1}`;
        const response = await fetch(Url)
        if (response.status !== 200)
          throw new Error(`error when fetching IMAGES : ${this.terms} from API`)
        
        const data = (await response.json());
        shuffle(data.data);
      // Swap array of images 
        this.append(data.data, (this.page+1));
        this.loading(false);
        console.log('load more images');
    },
 
  },
})
