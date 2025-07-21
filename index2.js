const http = require('http');
const fs = require("fs")
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require(`${__dirname}/modules/replaceTemplate.js`);
//Synchronous file read
 /* const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textIn)
const textOut = `This is what we know about avocado : ${textIn}.\nCreated on ${Date.now()}`
fs.writeFileSync('./txt/output.txt', textOut)
console.log("File Written!!!")  */

//Asynchronous file read
/* fs.readFile("./txt/start100.txt",'utf-8', (err, data)=>{
    fs.readFile(`./txt/${data}.txt`, 'utf-8', (err,data1)=>{
        fs.readFile('./txt/append.txt', 'utf-8', (err, data2)=>{
            fs.writeFile("./txt/final.txt", `${data1} \n ${data2}`, (err)=>{
                if(err) throw err;
                console.log("The file has been saved! 😂 ")
            })
        })
    })
})
console.log("Read the file ... ") */
    

//Synchronous API read
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempCart = fs.readFileSync(`${__dirname}/templates/template-cart.html`, 'utf-8');
const cart = fs.readFileSync(`${__dirname}/templates/cart.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map(ele => slugify(ele.productName, {
    lower : true
}));
console.log(slugs)
/* console.log(slugify('Fresh-Avacado', {
    lower : true
})) */

//Server
const server = http.createServer((req, res)=>{

    const {query, pathname} = url.parse(req.url, true);

    if(pathname === '/' ||pathname === '/overview'){
        res.writeHead(200, {
            'content-type' : 'text/html'
        })
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const resultent_output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(resultent_output);
    }else if(pathname === '/product'){
        res.writeHead(200, {
            'content-type' : 'text/html'
        })
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }else if(pathname === '/api') {
            res.writeHead(200, {
                'content-type' : 'application/json'
            })
            res.end(data);
    }else if(pathname === '/cart' ){
        res.writeHead(200, {
            'content-type' : 'text/html'
        })
        /* const product = dataObj[query.id];
        const crt = ()=>{
            dataObj[query.cart] == true;
        }; */
        /* const crt = fs.readFile(`${__dirname}/dev-data/data.json`, (err,write)=>{
            if(err) console.log(err);
            write = JSON.parse(write);
            write.push({'cart':true})
        })
        const cartHtml = dataObj.filter(el=> el.cart===true).map(el => replaceTemplate(cart, el)).join('');
        const output = tempCart.replace('{%PRODUCT_CART%}', cartHtml);
        res.end(output); */

        if (query.id !== undefined) {  // Ensure query.id is provided
            const productIndex = dataObj.findIndex(el => el.id == query.id);
            if (productIndex !== -1) {
                dataObj[productIndex].cart = true;
            }
        }

        // Write updated data back to file
        fs.writeFile(`${__dirname}/dev-data/data.json`, JSON.stringify(dataObj, null, 2), (err) => {
            if (err) {
                console.log(err);
                res.end('Error updating cart');
                return;
            }

            // Generate cart HTML
            const cartHtml = dataObj
                .filter(el => el.cart === true)
                .map(el => replaceTemplate(cart, el))
                .join('');

            const output = tempCart.replace('{%PRODUCT_CART%}', cartHtml);
            res.end(output);
        });
    }else{
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-header' : 'Hello-World'
        });
        res.end("<h1>THis page is not found!</h1>");
    }
   
})
server.listen(3000, '127.0.0.1', ()=>{
    console.log("Server is running on port 3000");
});

/*
Synchronous API read is better in this situation because no need for callback / calling a function continously, rather than just call once at the begining and 
respond in with the data.
*/
/* Asynchrous API read
const server = http.createServer((req, res)=>{
    const pathname = req.url;
    if(pathname === '/' ||pathname === '/overview'){
        res.end("This is the overview page")
    }else if(pathname === '/product'){
        res.end("This is the Product page");
    }else if(pathname === '/api') {
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err,data) => {
            const product_data = JSON.parse(data);
            res.writeHead(200, {
                'content-type' : 'application/json'
            })
            res.end(data);
        });
    }else{
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-header' : 'Hello-World'
        });
        res.end("<h1>THis page is not found!</h1>");
    }
   
})
server.listen(3000, '127.0.0.1', ()=>{
    console.log("Server is running on port 3000");
}) 
    
 */