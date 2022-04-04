import About from "@/components/about/About";
import DevWatch from "@/components/dev/DevWatch";
import BankWatch from "@/components/bank/BankWatch";
import Whales from "@/data/Whales";
import Personal from "@/components/personal/Personal";
import PersonalFront from "@/components/personal/PersonalFront";
import Epoch from "@/components/epoch/Epoch";
import Feedback from "@/components/feedback/Feedback";
import FeedbackThanks from "@/components/feedback/FeedbackThanks";
import WishingWell from "@/components/quest/WishingWell";
import QuestFront from "@/components/quest/QuestFront";
import Hero from "@/components/hero/Hero";
import HeroFront from "@/components/hero/HeroFront";
import HeroRanking from "@/components/about/HeroRanking";
import FloorPrice from "@/components/about/FloorPrice";
import Quests from "@/components/quest/Quests";

export default [
    {
        name: 'Frontpage',
        path: '/',
        //component: DevWatch,
        redirect: '/personal',
        meta: {
            title: "[K|W] Frontpage"
        }
    },
    {
        name: 'DevWatch',
        path: '/dev',
        component: DevWatch,
        meta: {
            title: "[K|W] Dev Wallets"
        }
    },
    {
        name: 'BankWatch',
        path: '/bank',
        component: BankWatch,
        meta: {
            title: "[K|W] Bank"
        }
    },
    {
        name: 'PersonalWatchAddress',
        path: '/personal/:userAddress',
        component: Personal,
        meta: {
            title: "[K|W] Personal"
        }
    },
    {
        name: 'PersonalWatch',
        path: '/personal/',
        component: PersonalFront,
        meta: {
            title: "[K|W] Personal"
        }
    },
    {
        name: 'EpochWatch',
        path: '/epochs',
        component: Epoch,
        meta: {
            title: "[K|W] Epoch"
        }
    },
    {
        name: 'QuestWatchAddress',
        path: '/wishingwell/:userAddress',
        component: WishingWell,
        meta: {
            title: "[K|W] Quests"
        }
    },
    {
        name: 'QuestWatch',
        path: '/quests',
        component: QuestFront,
        meta: {
            title: "[K|W] Quests"
        }
    },
    {
        name: 'QuestAddress',
        path: '/quests/:userAddress',
        component: Quests,
        meta: {
            title: "[K|W] Quests"
        }
    },
    {
        name: 'HeroWatch',
        path: '/hero',
        component: HeroFront,
        meta: {
            title: "[K|W] Hero"
        }
    },
    {
        name: 'HeroAddress',
        path: '/hero/:id',
        component: Hero,
        meta: {
            title: "[K|W] Hero"
        }
    },
    {
        name: 'Feedback',
        path: '/feedback',
        component: Feedback,
        meta: {
            title: "[K|W] Feedback"
        }
    },
    {
        name: 'FeedbackThanks',
        path: '/thankYouForTheFeedback',
        component: FeedbackThanks,
        meta: {
            title: "[K|W] Thanks!"
        }
    },

    {
        name: 'About',
        path: '/about',
        component: About,
        meta: {
            title: "[K|W] About"
        }
    },
    {
        name: 'KWPS',
        path: '/about/heroranking',
        component: HeroRanking,
        meta: {
            title: "[K|W] KWPS Profession Score"
        }
    },
    {
        name: 'KWFP',
        path: '/about/floorprice',
        component: FloorPrice,
        meta: {
            title: "[K|W] KWFP Floor Price"
        }
    },
    {
        name: 'Whales',
        path: '/whales',
        component: Whales,
        meta: {
            title: "[K|W] Whales"
        }
    },

]