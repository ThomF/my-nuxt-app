export const useHeroes = async () => {
    const client = useSupabaseClient()

    const { data, error } = await client.from('hero').select('*')
    if (error) throw error
    return data
}
