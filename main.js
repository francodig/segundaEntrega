const fs = require("fs").promises; 

class ProductManager{
    static ultId =0;
    constructor(path){
        this.products =[];
        this.path = path;
    }

    async addProduct(nuevoObjeto){
        let {title, description, price, img, code, stock} =nuevoObjeto;


        if(!title || !description || !price || !img || !code || !stock){
            console.log("Por favor completa todos los campos");
            return;
        }

        if(this.products.some(item=> item.code === code)){
            console.log("Estas ingresando un producto repetido");
            return;
        }

        const newProduct = {
            id:++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        this.products.push(newProduct);

        await this.guardarArchivo(this.products);
    }

    getProducts(){
        console.log(this.products);
    }

    async getProductbyId(id){
        try{
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item=> item.id===id);

            if(!buscado){
                console.log("Producto no encontrado");
            }
            else{
                console.log("Producto encontrado")
                return buscado;
            }
        }
        catch(error){
            console.log("Error al leer el archivo", error)
        }

    }

    async leerArchivo(){
        try{
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        }
        catch (error){
            console.log("Error al leer el archivo", error)
        }
    }
    // async leerArchivo() {
    //     try {
    //         const respuesta = await fs.readFile(this.path, 'utf-8');
    //         return JSON.parse(respuesta);
    //     } catch (error) {
    //         console.log('Error al leer el archivo', error);
    //         // Si hay un error, devuelve un array vacío
    //         return [];
    //     }
    // }
    async guardarArchivo(arrayProductos){
        try{
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
        }
        catch(error){
            console.log("Error al guardar el archivo", error)
        }
    }

    async actualizarProducto(id, productoActualizado){
        try{
            const arrayProductos= await this.leerArchivo(); 
            const index = arrayProductos.findIndex(item=>item.id===id);

            if(index !== -1){
                arrayProductos.splice(index,1, productoActualizado);
                await this.guardarArchivo(arrayProductos);
            }
            else{
                console.log("No se encontro el producto")
            }
        }
        catch(error){
            console.log("Error al actualizar el producto", error)
        }
    }


    // ------------------deleteProduct---------------------

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
                console.log("Producto eliminado");
            } else {
                console.log("No se encontró el producto para eliminar");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }
      
}



// 1)
const manager = new ProductManager("./productos.json");
// 2)
manager.getProducts();
// 3)
const arroz={
    title: "arroz",
    description:"aaaaa",
    price: 75,
    img:"Sin imagen", 
    code:"xyz123",
    stock: 125
}

manager.addProduct(arroz)
// 4)

const agua={
    title: "agua",
    description:"bbbbb",
    price: 125,
    img:"Sin imagen", 
    code:"xyz456",
    stock: 50
}

manager.addProduct(agua)

const azucar={
    title: "azucar",
    description:"ccccc",
    price: 325,
    img:"Sin imagen", 
    code:"xyz789",              
    stock: 170
}

manager.addProduct(azucar)

// 5)
manager.getProducts()

// 6)
async function testBusquedaPorId(){
    const buscado = await manager.getProductbyId(1);
    console.log(buscado)
}

testBusquedaPorId();

// 7)

const arvejas={
    id: 1,
    title: "arvejas",
    description:"ccccc",
    price: 225,
    img:"Sin imagen", 
    code:"xyz789",              
    stock: 200
}

async function testeamosActualizar(){
    await manager.actualizarProducto(1, arvejas);
}

testeamosActualizar();

// 8)
async function testEliminarProducto() {
    console.log("Productos antes de eliminar:");
    manager.getProducts();

    // Intentar eliminar un producto existente 
    await manager.deleteProduct(1);

    console.log("Productos después de eliminar:");
    manager.getProducts();

    // Intentar eliminar un producto que no existe
    await manager.deleteProduct(100);

    // Ver el estado persistente después de la eliminación
    console.log("Productos después de intentar eliminar un producto inexistente:");
    await manager.getProducts();
}

testEliminarProducto();