import { useStore } from '@src/render/store'
import { useEffect, useRef } from 'react'
import { SidebarInset } from '../ui/sidebar'
import ContentHeader from './content-header'

const Content = () => {
    const { selectMail } = useStore()
    const hostRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (hostRef.current && selectMail?.html) {
            let shadow: ShadowRoot
            if (hostRef.current.shadowRoot) {
                shadow = hostRef.current.shadowRoot
            } else {
                shadow = hostRef.current.attachShadow({ mode: 'open' })
            }
            shadow.innerHTML = selectMail?.html
        }
    }, [selectMail?.html])

    return (
        <div className="flex-1 overflow-hidden !h-full">
            {selectMail?.id && (
                <div className="flex flex-1 flex-col overflow-hidden  !h-full">
                    <ContentHeader />
                    <div
                        ref={hostRef}
                        className="w-full !h-[calc(100%-100px)] p-10 "
                        style={{
                            height: '200px',
                            overflow: 'scroll',
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default Content
