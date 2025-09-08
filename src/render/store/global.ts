import { EmailChannel, MailChannel } from '@src/domains'
import type { EmailBoxType, EmailType, MailType } from '@src/domains/types'
import { create } from 'zustand'

interface State {
    collapse: boolean
    setCollapse: (collapse: boolean) => void
    loading: boolean
    setLoading: (loading: boolean) => void
    listLoading: boolean
    setListLoading: (loading: boolean) => void
    menu: EmailBoxType[]
    setMenu: (menu: EmailBoxType[]) => void
    selectMenu: EmailBoxType | null
    setSelectMenu: (menu: EmailBoxType) => void
    paginationState: {
        total: number
        pageNo: number
        pageSize: number
    }
    setPaginationState: (state: { pageNo: number; pageSize: number; total: number }) => void
    mails: MailType[]
    setMails: (mails: MailType[]) => void
    selectMail: MailType | null
    setSelectMail: (mail: MailType | null) => void
    searchState: {
        keyword: string
        unRead: boolean
    }
    setSearchState: (state: { keyword: string; unRead: boolean }) => void
    reloadMail: ({
        box,
        keyword,
        unRead,
        pageNo,
        pageSzie,
    }: {
        box?: string
        keyword?: string
        unRead?: boolean
        pageNo?: number
        pageSzie?: number
    }) => Promise<{ hasNext: boolean }>
}

export const useStore = create<State>((set, get) => {
    window.IPC.invoke<EmailType[]>(EmailChannel.GetAllEmail)
        .then(res => {
            const data = res?.[0]
            if (data?.id) {
                return window.IPC.invoke(MailChannel.Init, data as Partial<EmailType>).then(() => {
                    window.IPC.invoke(MailChannel.CheckMails)
                    window.IPC.invoke<EmailBoxType[]>(MailChannel.GetBoxes).then(boxes => {
                        const _currentBoxes = boxes?.[0]
                        set({
                            selectMenu: _currentBoxes,
                            menu: boxes || [],
                        })
                        window.IPC.invoke<{
                            data: MailType[]
                            pageNo: number
                            pageSize: number
                            total: number
                        }>(MailChannel.GetMailList, {
                            emailId: data?.email,
                            box: _currentBoxes?.name,
                            pageNo: get().paginationState?.pageNo,
                            pageSize: get().paginationState?.pageSize,
                        }).then(mailsData => {
                            set({
                                mails: mailsData?.data || [],
                                paginationState: {
                                    total: mailsData?.total,
                                    pageNo: mailsData?.pageNo,
                                    pageSize: mailsData?.pageSize,
                                },
                            })
                        })
                    })

                    return window.IPC.invoke<EmailBoxType[]>(MailChannel.GetBoxes).then(boxes => {
                        set({ menu: boxes })
                    })
                })
            }
            return Promise.resolve()
        })
        .finally(() => set({ loading: false }))

    return {
        collapse: false,
        setCollapse: (collapse: boolean) =>
            set({
                collapse,
            }),
        loading: true,
        setLoading: (loading: boolean) =>
            set({
                loading,
            }),
        listLoading: false,
        setListLoading: (loading: boolean) => set({ listLoading: loading }),
        menu: [],
        setMenu: (menu: EmailBoxType[]) => set({ menu }),
        selectMenu: null,
        setSelectMenu: (menu: EmailBoxType) =>
            set({
                selectMenu: menu,
            }),

        mails: [],
        setMails: (mails: MailType[]) => set({ mails }),
        selectMail: null,
        setSelectMail: (mail: MailType | null) => set({ selectMail: mail }),
        searchState: {
            keyword: '',
            unRead: false,
        },
        setSearchState: (state: Partial<{ keyword: string; unRead: boolean }>) => {
            set({ searchState: { ...get().searchState, ...state } })
        },
        reloadMail: ({
            box,
            keyword,
            unRead,
            pageNo,
            pageSzie,
        }: {
            box?: string
            keyword?: string
            unRead?: boolean
            pageNo?: number
            pageSzie?: number
        }) => {
            if (get().listLoading) return Promise.resolve({ hasNext: false })
            set({
                listLoading: true,
                searchState: {
                    ...get().searchState,
                    keyword: keyword || get().searchState?.keyword,
                    unRead: unRead ?? get().searchState?.unRead,
                },
            })
            console.log(get().searchState, 'searchState')
            return window.IPC.invoke<{
                data: MailType[]
                pageNo: number
                pageSize: number
                total: number
            }>(MailChannel.GetMailList, {
                emailId: '2893096286@qq.com',
                box: box ?? get().selectMenu?.name,
                keyword: keyword ?? get()?.searchState?.keyword,
                unRead: unRead ?? get().searchState?.unRead,
                pageNo: pageNo ?? get().paginationState?.pageNo,
                pageSize: pageSzie ?? get().paginationState?.pageSize,
            })
                .then(res => {
                    console.log(res, 'rrr')
                    set({
                        mails: [...get().mails, ...(res as any).data],
                        paginationState: {
                            pageNo: res?.pageNo ?? get().paginationState?.pageNo,
                            pageSize: res?.pageSize ?? get().paginationState?.pageSize,
                            total: res?.total ?? get().paginationState?.total,
                        },
                    })
                    return {
                        hasNext: res?.data?.length > 0,
                    }
                })
                .finally(() => set({ listLoading: false }))
        },
        paginationState: {
            pageNo: 1,
            pageSize: 50,
            total: 0,
        },
        setPaginationState: (state: { pageNo: number; pageSize: number; total: number }) =>
            set({ paginationState: state }),
    }
})
