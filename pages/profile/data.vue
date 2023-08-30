<script setup>
import style from './data.module.css'

const sb = useSupabaseClient()
const u = useSupabaseUser()

const adata = useAsyncData(async () => {
  if (u.value) {
    const auth = u.value
    const profile = await sb.from('profiles').select('*').eq('id', u.value.id).single()
    const history = await sb.from('episode_progression').select('*').eq('viewer', u.value.id).order('last_watched', { ascending: false })
    console.log(profile)
    return {
      auth,
      profile,
      history
    }
  } else {
    return null
  }
})
</script>
<template>
  <div :class="style.container">
    <Sidenav />
    <template v-if="adata.pending.value">
      <h1>Loading Data</h1>
    </template>
    <template v-else-if="adata.data.value">
      <div :class="style.content">
        <h1>Data</h1>
        <p>
          Because we know that a lot of WAN show viewers are privacy focused, and we ourselves hate having to sign up to
          new websites. We are trying to be as open with what information we track as we can.
          <br>
          This means that we want you to know exactly what information we are storing about your account at all times.
          So here is a full, up to date as of right now, list of every piece of information that is referenced to your
          account.
        </p>
        <Accordion>
          <template #header>
            Authentication Data
          </template>
          <template #default>
            <p>
              Here is a breakdown of all the information we collected when you signed up for your account:
            </p>
            <table>
              <thead>
                <tr>
                  <td>Field</td>
                  <td>Value</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{{ adata.data.value.auth.id }}</td>
                </tr>
                <tr>
                  <td>AUD</td>
                  <td>{{ adata.data.value.auth.aud }}</td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td>{{ adata.data.value.auth.role }}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{{ adata.data.value.auth.email }}</td>
                </tr>
                <tr>
                  <td>Email Confirmation Time</td>
                  <td>
                    {{ adata.data.value.auth.email_confirmed_at }} ({{ new
                      Date(adata.data.value.auth.email_confirmed_at).toLocaleString() }})
                  </td>
                </tr>
                <tr>
                  <td>Last Sign In Time</td>
                  <td>
                    {{ adata.data.value.auth.last_sign_in_at }} ({{ new
                      Date(adata.data.value.auth.last_sign_in_at).toLocaleString() }})
                  </td>
                </tr>
                <tr>
                  <td>Last Updated</td>
                  <td>
                    {{ adata.data.value.auth.updated_at }} ({{ new
                      Date(adata.data.value.auth.updated_at).toLocaleString() }})
                  </td>
                </tr>
                <tr>
                  <td>Identities</td>
                  <td>
                    <ul>
                      <template v-for="(id, index) in adata.data.value.auth.identities" :key="index">
                        <li>
                          <h3>{{ index + 1 }} - {{ id.provider }}</h3>
                          <table>
                            <thead>
                              <tr>
                                <td>Field</td>
                                <td>Value</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>ID</td>
                                <td>{{ id.id }}</td>
                              </tr>
                              <tr>
                                <td>Created At</td>
                                <td>
                                  {{ id.created_at }} ({{ new
                                    Date(id.created_at).toLocaleString() }})
                                </td>
                              </tr>
                              <tr>
                                <td>Last Sign In Time</td>
                                <td>
                                  {{ id.last_sign_in_at }} ({{ new
                                    Date(id.last_sign_in_at).toLocaleString() }})
                                </td>
                              </tr>
                              <tr>
                                <td>Last Updated</td>
                                <td>
                                  {{ id.updated_at }} ({{ new
                                    Date(id.updated_at).toLocaleString() }})
                                </td>
                              </tr>
                              <tr>
                                <td>Identity Data</td>
                                <td>
                                  <table>
                                    <thead>
                                      <tr>
                                        <td>Field</td>
                                        <td>Value</td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>Provider ID</td>
                                        <td>{{ id.identity_data.provider_id }}</td>
                                      </tr>
                                      <tr>
                                        <td>Email</td>
                                        <td>{{ id.identity_data.email }}</td>
                                      </tr>
                                      <tr>
                                        <td>Email Verified</td>
                                        <td>{{ id.identity_data.email_verified ? 'Yes' : 'No' }}</td>
                                      </tr>
                                      <tr>
                                        <td>Full Name</td>
                                        <td>{{ id.identity_data.full_name }}</td>
                                      </tr>
                                      <tr>
                                        <td>Name</td>
                                        <td>{{ id.identity_data.name }}</td>
                                      </tr>
                                      <tr>
                                        <td>ISS</td>
                                        <td>{{ id.identity_data.iss }}</td>
                                      </tr>
                                      <tr>
                                        <td>Provider ID</td>
                                        <td>{{ id.identity_data.provider_id }}</td>
                                      </tr>
                                      <tr>
                                        <td>Sub</td>
                                        <td>{{ id.identity_data.sub }}</td>
                                      </tr>
                                      <tr>
                                        <td>Avatar URL</td>
                                        <td>
                                          <img :src="id.identity_data.avatar_url">
                                          {{ id.identity_data.avatar_url }}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Picture URL</td>
                                        <td>
                                          <img :src="id.identity_data.picture">
                                          {{ id.identity_data.picture }}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </li>
                      </template>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </Accordion>
        <Accordion>
          <template #header>
            Profile Data
          </template>
          <template #default>
            <p>
              Here is a breakdown of all the information we have about your user profile:
            </p>
            <table>
              <thead>
                <tr>
                  <td>Field</td>
                  <td>Value</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{{ adata.data.value.profile.data.id }}</td>
                </tr>
                <tr>
                  <td>Full Name</td>
                  <td>{{ adata.data.value.profile.data.full_name }}</td>
                </tr>
                <tr>
                  <td>Username</td>
                  <td>{{ adata.data.value.profile.data.username }}</td>
                </tr>
                <tr>
                  <td>Profile Flags</td>
                  <td>
                    Raw Value: {{ adata.data.value.profile.data.flags }}
                    <br>
                    Note: <a href="https://github.com/AltriusRS/wandb/discussions/26" style="color:#fff">Flags spec</a> is
                    not currently finalized
                  </td>
                </tr>
                <tr>
                  <td>Permission Flags</td>
                  Raw Value: {{ adata.data.value.profile.data.permissions }}
                  <br>
                  Note: <a href="https://github.com/AltriusRS/wandb/discussions/27" style="color:#fff">Permissions
                    spec</a> is not currently finalized
                </tr>
                <tr>
                  <td>Avatar URL</td>
                  <td>
                    <img :src="adata.data.value.profile.data.avatar_url">
                    {{ adata.data.value.profile.data.avatar_url }}
                  </td>
                </tr>
                <tr>
                  <td>Last Updated</td>
                  <td>
                    {{ adata.data.value.profile.data.updated_at }} ({{ new
                      Date(adata.data.value.profile.data.updated_at).toLocaleString() }})
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </Accordion>
        <Accordion show>
          <template #header>
            Watch History Data
          </template>
          <template #default>
            <p>
              Here is a breakdown of all the information we have about your watch history on our platform:
            </p>
            <table>
              <thead>
                <tr>
                  <td>Video ID</td>
                  <td>Position</td>
                  <td>Position (seconds)</td>
                  <td>Last Viewed</td>
                </tr>
              </thead>
              <tbody>
                <template v-for="(video, index) in adata.data.value.history.data" :key="index">
                  <tr>
                    <td>{{ video.episode }}</td>
                    <td>{{ toTimestamp(video.viewed_seconds) }}</td>
                    <td>{{ video.viewed_seconds }}</td>
                    <td>{{ new Date(video.last_watched).toLocaleString() }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
        </Accordion>
      </div>
    </template>
    <template v-else>
      <h1>An Error has occurred</h1>
    </template>
  </div>
</template>
