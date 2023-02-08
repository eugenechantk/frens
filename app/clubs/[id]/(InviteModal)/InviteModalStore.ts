import { proxy } from 'valtio'

interface State {
  open: boolean;
}

const state = proxy<State>({
  open: false
})

const InviteModalStore = {
  state,
  open() {
    state.open = true
  }, 

  close() {
    state.open = false
  }
}

export default InviteModalStore
