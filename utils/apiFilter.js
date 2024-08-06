
class ApiFilter {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
        this.filterProductcount = 0
    }
    search() {
        const keyword = this.queryString.category
            ? {
                category: {
                    $regex: this.queryString.category,
                    $options: "i",
                }
            }
            : {}
        this.query = this.query.find({ ...keyword })
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryString }
        const removeKeyword = ["category", "page", "limit"]

        removeKeyword.forEach(key => delete queryCopy[key])

        let queryStr = JSON.stringify(queryCopy)

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }
    pagination(perPagelimit) {
        const currentpage = Number(this.queryString.page) || 1
        const skip = perPagelimit * (currentpage - 1)
        this.query = this.query.limit(perPagelimit).skip(skip)
        return this
    }

}

module.exports = ApiFilter;