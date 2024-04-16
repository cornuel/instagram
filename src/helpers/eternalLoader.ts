import { usePostStore } from '@/stores';
import type { IPaginatedPosts } from '@/types';
import type { LoadAction } from '@/types/vue-eternal'
import { storeToRefs } from 'pinia';

export async function load<T>(
  fetchFunction:
    (page: number, query?: string) => Promise<IPaginatedPosts | null>,
  { loaded }: LoadAction,
  page: number,
  query?: string,
): Promise<void> {
  const { getShowedPosts } = usePostStore()
  if (getShowedPosts()?.next) {
    try {
      // getUserPosts(), getFavoritedPosts(),fetchPostsByTagQuery()
      let fetchedData: IPaginatedPosts | null
      if (query) {
        fetchedData = await fetchFunction(page, query);
      }
      else {
        fetchedData = await fetchFunction(page);
      }

      if (fetchedData) {
        const { showedPosts } = storeToRefs(usePostStore());
        showedPosts.value?.results?.push(...fetchedData.results!);
        loaded(fetchedData.results!.length, 9);
      } else {
        loaded(0, 0);
      }
    } catch (error) {
      console.error('An error occurred while loading data:', error);
      loaded(0, 0);
    }
  } else {
    loaded(0, 0);
  }
}