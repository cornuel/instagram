<script lang="ts" setup>
import SearchListVue from './SearchList.vue'
import ConfirmPopup from '@/components/Popup/ConfirmPopup.vue'

import { ref, watch, onMounted } from 'vue'
import { debounce } from '@/helpers'
import { type IProfile } from '@/types'
import { useSearch } from '@/composables'
import { useSearchStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { unionBy, remove } from 'lodash'

const isFocus = ref(false)
const isLoading = ref(false)
const isSearch = ref(false)
const deleteAllPopup = ref(false)
const searchInput = ref('')
const searchHistory = ref<IProfile[]>([])
const searchList = ref<IProfile[]>([])
const { searchedProfiles } = storeToRefs(useSearchStore())

const emit = defineEmits(['close'])

const handleResetSearch = () => {
  searchInput.value = ''
  isSearch.value = false
  searchList.value = [] as IProfile[]
}

const searchProfile = async (query: string) => {
  const { setQuery, setSearchedProfiles } = useSearchStore()
  const { fetchProfilesByQuery } = useSearch()

  setQuery(query)

  const res = await fetchProfilesByQuery(1, query)

  if (res) {
    setSearchedProfiles(res)
  }
}

const updateSearchHistory = async () => {
  // const { updateUser } = useUser()
  // const { currentUser } = useUserStore()
  // const searchHistoryIds = searchHistory.value?.map((user) => user.id)
  // await updateUser(currentUser!.id, {
  //   searchHistory: searchHistoryIds
  // } as IUserInfo)
}

const addSearchHistory = async (user: IProfile) => {
  searchHistory.value = unionBy([user], searchHistory.value, 'id')
  await updateSearchHistory()
}

const removeSearchHistory = async (user: IProfile) => {
  searchHistory.value = remove(
    searchHistory.value!,
    (item) => item.id !== user.id
  )
  await updateSearchHistory()
}

const handleClickSearchItem = async (user: IProfile) => {
  emit('close')
  await addSearchHistory(user)
}

const handleClickHistoryItem = async (user: IProfile) => {
  emit('close')
  await addSearchHistory(user)
}

const handleDeleteHistoryItem = async (user: IProfile) => {
  await removeSearchHistory(user)
}

const handleDeleteAllHistory = async () => {
  searchHistory.value = []
  closeDeleteAllPopup()
  await updateSearchHistory()
}

const closeDeleteAllPopup = () => {
  deleteAllPopup.value = false
}

watch(searchInput, (value) => {
  isLoading.value = true
  debounce(async () => {
    if (value != '') {
      isSearch.value = true
      await searchProfile(value)
    } else {
      handleResetSearch()
    }
    isLoading.value = false
  }, 300)
})

onMounted(async () => {
  // const { getUserSearchHistory } = useUser()
  // searchHistory.value = await getUserSearchHistory()
})
</script>

<template>
  <div
    class="panel flex flex-col w-[400px] h-full py-4 bg-bgColor-primary border-r border-borderColor rounded-tr-2xl rounded-br-2xl"
  >
    <span class="block m-2 px-4 text-textColor-primary text-2xl font-semibold"
      >Search</span
    >
    <div class="flex flex-col mt-8 flex-1">
      <div
        class="relative flex items-center mx-4 rounded-lg bg-[#EFEFEF] dark:bg-[#262626]"
        :class="{ focus: isFocus }"
      >
        <fa
          class="w-4 ml-4 parent-[.focus]:hidden text-[#8e8e8e]"
          :icon="['fas', 'magnifying-glass']"
        />
        <input
          class="flex-grow w-full py-2 pr-4 pl-3 parent-[.focus]:pl-4 text-base bg-transparent placeholder-[#8e8e8e]"
          type="text"
          placeholder="Search"
          v-model="searchInput"
          @focus="isFocus = true"
          v-click-outside="
            () => {
              isFocus = false
            }
          "
        />
        <div
          v-show="isFocus"
          class="absolute top-1/2 right-4 -translate-y-1/2"
        >
          <div
            v-if="isLoading"
            class="animate-spin text-[#c8c8c8]"
          >
            <fa :icon="['fas', 'spinner']" />
          </div>
          <fa
            v-else
            class="text-[#c7c7c7] cursor-pointer"
            :icon="['fas', 'circle-xmark']"
            @click="handleResetSearch"
          />
        </div>
      </div>
      <div class="mt-6 border-t border-borderColor"></div>
      <div
        v-if="!isSearch"
        class="flex-shrink flex-grow basis-0 overflow-y-auto"
      >
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between my-4 px-6">
            <span class="text-base font-semibold">Recent</span>
            <span
              v-if="searchHistory && searchHistory.length > 0"
              class="text-sm font-semibold text-buttonColor-primary hover:text-link cursor-pointer"
              @click="
                () => {
                  deleteAllPopup = true
                }
              "
              >Clear all</span
            >
          </div>
          <SearchListVue
            :searchList="searchHistory"
            hasDelete
            notFoundMessage="No recent search results."
            @clickItem="handleClickHistoryItem"
            @deleteItem="handleDeleteHistoryItem"
          />
        </div>
      </div>
      <div
        v-else
        class="flex-shrink flex-grow basis-0 overflow-y-auto"
      >
        <SearchListVue
          :searchList="searchedProfiles?.results as IProfile[]"
          notFoundMessage="No results found."
          @clickItem="handleClickSearchItem"
        />
      </div>
    </div>
    <ConfirmPopup
      v-if="deleteAllPopup"
      title="Clear search history?"
      desc="You won't be able to undo this. If you clear your search history, you may still see accounts you've searched for as suggested results."
      confirmMessage="Clear all"
      cancelMessage="Not now"
      @confirm="handleDeleteAllHistory"
      @cancel="closeDeleteAllPopup"
      @click-outside="closeDeleteAllPopup"
    />
  </div>
</template>

<style>
.panel {
  box-shadow:
    rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px,
    rgba(17, 17, 26, 0.1) 0px 16px 56px;
}
</style>
