const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList} = graphql;
const _ = require('loadsh');
const Book = require('../modules/book')
const Author = require('../modules/author')


var books = [
    {name: 'Harrypotter', genre: 'Fantasy', id: '1', authorId: '1'},
    {name: 'Harrypotter II', genre: 'Suspense', id: '13', author: 'MSI', authorId: '2'},
    {name: 'Harrypotter III', genre: 'Sci-Fi', id: '2', authorId: '3'},
    {name: 'Harrypotter IV', genre: 'Sci-Fi', id: '12', authorId: '4'},
    {name: 'Harrypotter V', genre: 'Suspense', id: '21', authorId: '2'},
    {name: 'Harrypotter VI', genre: 'Thriller', id: '112', authorId: '1'},
];

var authors = [
    {name: 'MSI', age: 44, id: '1'},
    {name: 'Neil', age: 35, id: '3'},
    {name: 'Patrick', age: 20, id: '2'},
    {name: 'Haris', age: 56, id: '4'},
]
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
               // return _.find(authors, {id: parent.authorId})
                return Author.findById(parent.authorId)
            }
        },
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
              //  return _.filter(books, {id: parent.id})
                return Book.find({authorId: parent.id})
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
               // return _.find(books, {id: args.id});
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                //return _.find(authors, {id: args.id})
                return Author.findById(args.id)
            }

        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return books
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                //return authors
                return Author.find({})
            }
        }
    }

});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor:{
            type: AuthorType,
            args:{
                name : {type: GraphQLString},
                age : { type: GraphQLInt}
            },
            resolve(parent,args){
                let author = new Author({
                    name : args.name,
                    age : args.age
                })
                return author.save()
            }

        },
        addBook :{
            type : BookType,
            args : {
                name : { type : GraphQLString},
                genre : {type: GraphQLString},
                authorId: {type : GraphQLID}
            },
            resolve(parent,args){
                let book = new Book({
                    name : args.name,
                    genre : args.genre,
                    authorId: args.authorId
                })
                return book.save()
            }

        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation,
})