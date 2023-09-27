export interface ClickHandler {
  type: string,
  target?: string,
  url?: string
}

export function notificationHandler(body: any, toast: any) {
  console.log('notification handler', body)
  if (body.flags.interactive === true) {
    const t = {
      ...body.toast
    }

    t.actions = body.actions.map((a: any) => {
      const b = a.visible
      b.click = () => handleClick(a.handler)
      return b
    })

    toast.add(t)
  } else {
    toast.add(body.toast)
  }
}

// Method to handle click actions on interactive notifications
function handleClick(handler: ClickHandler) {
  switch (handler.type) {
    case 'redirect':
      window.open(handler.url, handler.target)
      break
    default:
      console.log('Unknown click handler type', handler.type)
      break
  }
}
