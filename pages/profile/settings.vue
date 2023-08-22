<template>
    <Header />
    <div :class="style.container">
        <Sidenav />
        <div v-if="profile" :class="style.profile">
            <div :class="style.profileImg">
                <img :src="profile.avatar_url" />
            </div>
            <div :class="style.profileSettings">
                <div :class="style.setting">
                    <span :class="style.tooltip">
                        <Icon :class="tootlip" name="medical-icon:i-information-us" />
                        <span :class="style.tooltiptext">This name is what other users will see when you interact with them.
                        </span>
                    </span>
                    <TextEditorSetting :current="profile.username" :editor="settingValues.username"
                        placeholder="No Username Set" vname="Username"
                        @saved="(e) => { console.log(e); settingValues.username.value = e; }" />
                </div>
                <div :class="style.setting">
                    <span :class="style.tooltip">
                        <Icon :class="tootlip" name="medical-icon:i-information-us" />
                        <span :class="style.tooltiptext">This information is provided to us when you create your account, by
                            the
                            service you signed in with for the first time.
                        </span>
                    </span>
                    <TextEditorSetting :current="profile.full_name" :editor="settingValues.name" placeholder="No Name Set"
                        vname="Login Name" @saved="(e) => { settingValues.name.value = e }" />
                </div>
            </div>
            <div v-if="data.stats.data[0]" :class="style.profileStatistics">
                <h2>Watch Statistics</h2>

                <div :class="style.charts">
                    <div :class=style.chart>
                        <h4>Total Watch Time</h4>
                        <div id="totalWatchTimeChartBox">
                            <p>Loading Data...</p>
                        </div>
                        <div :class="style.chartValue" id="totalWatchTimeChartValue" />
                    </div>
                    <div :class="style.chart">
                        <h4>Episodes Started</h4>
                        <div id="episodesStartedChartBox">
                            <p>Loading Data...</p>
                        </div>
                        <div :class="style.chartValue" id="episodesStartedChartValue" />
                    </div>
                    <div :class="style.chart">
                        <h4>Episodes Finished</h4>
                        <div id="episodesFinishedChartBox">
                            <p>Loading Data...</p>
                        </div>
                        <div :class="style.chartValue" id="episodesFinishedChartValue" />
                    </div>
                    <div :class="style.chart">
                        <h4>Average Watch Time</h4>
                        <div id="avgWatchTimeChartBox">
                            <p>Loading Data...</p>
                        </div>
                        <div :class="style.chartValue" id="avgWatchTimeChartValue" />
                    </div>
                    <div :class="style.chart">
                        <h4>Average Completion</h4>
                        <div id="avgCompletionChartBox">
                            <p>Loading Data...</p>
                        </div>
                        <div :class="style.chartValue" id="avgCompletionChartValue" />
                    </div>
                </div>
                <!-- <template v-if="data.history.data">
                    <span><strong>Episodes Started</strong>: {{ calcStarted(data.history.data) }}</span> |
                    <span><strong>Episodes Finished</strong>: {{ calcFinished(data.history.data) }}</span> |
                    <span><strong>Average Watch Time</strong>: {{ calcWatchTime(data.history.data) }}</span> |
                    <span><strong>Average Completion</strong>: {{ calcCompletion(data.history.data) }}%</span>
                </template>
                <template v-else>
                    <span><strong>Episodes Started</strong> No Data</span> |
                    <span><strong>Episodes Finished</strong> No Data</span> |
                    <span><strong>Average Watch Time</strong> No Data</span> |
                    <span><strong>Average Completion</strong> No Data</span>
                </template> -->
            </div>

        </div>
        <div :class="style.watchHistory">
            <div>
                <table>
                    <caption>
                        Our products
                        <p>Browse a list of Flowbite
                            products
                            designed to help you work and play, stay organized, get answers, keep in touch, grow your
                            business, and
                            more.</p>
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">
                                Product name
                            </th>
                            <th scope="col">
                                Color
                            </th>
                            <th scope="col">
                                Category
                            </th>
                            <th scope="col">
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Apple MacBook Pro 17"
                            </th>
                            <td class="px-6 py-4">
                                Silver
                            </td>
                            <td class="px-6 py-4">
                                Laptop
                            </td>
                            <td class="px-6 py-4">
                                $2999
                            </td>
                            <td class="px-6 py-4 text-right">
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                            </td>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Microsoft Surface Pro
                            </th>
                            <td class="px-6 py-4">
                                White
                            </td>
                            <td class="px-6 py-4">
                                Laptop PC
                            </td>
                            <td class="px-6 py-4">
                                $1999
                            </td>
                            <td class="px-6 py-4 text-right">
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Magic Mouse 2
                            </th>
                            <td class="px-6 py-4">
                                Black
                            </td>
                            <td class="px-6 py-4">
                                Accessories
                            </td>
                            <td class="px-6 py-4">
                                $99
                            </td>
                            <td class="px-6 py-4 text-right">
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
<Footer /></template>