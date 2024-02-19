import Home from '@icons/home.svg'
import HomeActive from '@icons/home-active.svg'
import Search from '@icons/glass.svg'
import SearchActive from '@icons/glass-active.svg'
import Explore from '@icons/explore.svg'
import ExploreActive from '@icons/explore-active.svg'
import Reel from '@icons/reel.svg'
import ReelActive from '@icons/reel-active.svg'
import Messenger from '@icons/messenger.svg'
import MessengerActive from '@icons/messenger-active.svg'
import Heart from '@icons/heart.svg'
import HeartActive from '@icons/heart-active.svg'
import Plus from '@icons/plus-square.svg'
import PlusActive from '@icons/plus-square-active.svg'
import Bar from '@icons/bar.svg'
import BarActive from '@icons/bar-active.svg'

import { shallowRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore, useResizeStore } from '@/stores'
import { type INav, NavTabEnum } from '@/types'

export const useNav = () => {
  const { authenticatedProfile } = useProfileStore()

  const NAVS: INav[] = [
    {
      name: NavTabEnum.Home,
      title: 'Home',
      icon: Home,
      iconActive: HomeActive,
      path: '/'
    },
    {
      name: NavTabEnum.Search,
      title: 'Search',
      icon: Search,
      iconActive: SearchActive,
    },
    {
      name: NavTabEnum.Explore,
      title: 'Explore',
      icon: Explore,
      iconActive: ExploreActive,
      path: '/explore'
    },
    {
      name: NavTabEnum.Reels,
      title: 'Reels',
      icon: Reel,
      iconActive: ReelActive,
      path: '/'
    },
    {
      name: NavTabEnum.Messenger,
      title: 'Messages',
      icon: Messenger,
      iconActive: MessengerActive,
      path: '/'
    },
    {
      name: NavTabEnum.Notification,
      title: 'Notifications',
      icon: Heart,
      iconActive: HeartActive,
    },
    {
      name: NavTabEnum.CreatePost,
      title: 'Create',
      icon: Plus,
      iconActive: PlusActive,
    },
    {
      name: NavTabEnum.Profile,
      title: 'Profile',
      path: `/${authenticatedProfile?.username}`
    }
  ]

  const NAVS_MOBILE: INav[] = [
    {
      name: NavTabEnum.Home,
      title: 'Home',
      icon: Home,
      iconActive: HomeActive,
      path: '/'
    },
    {
      name: NavTabEnum.Explore,
      title: 'Explore',
      icon: Explore,
      iconActive: ExploreActive,
      path: '/explore'
    },
    {
      name: NavTabEnum.Reels,
      title: 'Reels',
      icon: Reel,
      iconActive: ReelActive,
      path: '/'
    },
    {
      name: NavTabEnum.CreatePost,
      title: 'Create',
      icon: Plus,
      iconActive: PlusActive,
    },
    {
      name: NavTabEnum.Messenger,
      title: 'Messages',
      icon: Messenger,
      iconActive: MessengerActive,
      path: '/'
    },
    {
      name: NavTabEnum.Profile,
      title: 'Profile',
      path: `/${authenticatedProfile?.username}`
    }
  ]

  const tabBar: INav = {
    name: NavTabEnum.Bar,
    title: 'More',
    icon: Bar,
    iconActive: BarActive
  }

  const navs = shallowRef<INav[]>([])
  const { screen } = storeToRefs(useResizeStore())

  watch(
    screen,
    (newValue) => {
      if (newValue == 'mobile') navs.value = NAVS_MOBILE
      else navs.value = NAVS
    },
    {
      immediate: true
    }
  )

  return {
    navs,
    tabBar
  }
}
