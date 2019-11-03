import React from 'react';
// import logo from './logo.svg';
import './App.css';
import products from './seed';

//Product List - Parent Component
class ProductList extends React.Component {
  
  // constructor(props) {
  //   super(props);


  //   this.state = {
  //     products: [] //empty list
  //   }
    
  //   this.handleProductUpVote = this.handleProductUpVote.bind(this);
  // }

  //Default state of the productList component
  state = {
    products: []
  }

  //Function to upvote a product
  handleProductUpVote = (productId) => {
    // console.log(productId + ' was upvoted.');

    const nextProducts = this.state.products.map((product) => {
      if(product.id === productId) {
        return Object.assign({}, product, {
          votes: product.votes + 1
        });
      }
      else {
        return product;
      }
    });

    this.setState({
      products: nextProducts
    });
  }

  componentDidMount() {
    this.setState({
      products: products
    })
  }

  render() {
    //Sort products by votes (descending order)
    const sortedProducts = this.state.products.sort((a,b) => (b.votes - a.votes));

    const productComponents = sortedProducts.map(product => 
      <Product 
        id={product.id}
        key={'product-' + product.id}
        title={product.title}
        description={product.description}
        url={product.url}
        votes={product.votes}
        onVote={this.handleProductUpVote}
      />
    );

    return (
      <div className="productList">{productComponents}</div>
    );
  }
}

//Product - Child component
class Product extends React.Component {

  //Event handler for upvote
  handleUpVote = () => (
    this.props.onVote(this.props.id)
  );

  constructor(props) {
    super(props);

    /*
      Bind custom component methods.
    */
    this.handleUpVote = this.handleUpVote.bind(this);
  }

  render() {
    return (
      <div className="product">
        <div className="img"></div>
        <div className="content">
          <div className="description">
            <div>
              <h3><a href={this.props.url}>{this.props.title}</a></h3>
              <p>{this.props.description}</p>
            </div>
            <div className="vote-counter">
              <button onClick={this.handleUpVote}>
                <i className="fas fa-caret-up"></i> {this.props.votes}
              </button>
            </div>
          </div>
          <div className="extra">
            <div className="avatar"></div>
            <span>John Doe</span>
          </div>
        </div>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <h2>Popular Products</h2>
      <ProductList />
    </div>
  );
}

export default App;
