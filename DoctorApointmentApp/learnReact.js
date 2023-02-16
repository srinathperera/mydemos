
//this is JSX ( extenion to java script to embed html)		
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;
//You can put any valid JavaScript expression inside the curly braces in JSX. 

const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);

//Applications built with just React usually have a single root DOM node. If you are 
//integrating React into an existing app, you may have as many isolated root DOM nodes as you like.
//To render a React element, first pass the DOM element to ReactDOM.createRoot(), then pass the React element to root.render():

//simple basic react
const root = ReactDOM.createRoot(
  document.getElementById('root')
);
const element = <h1>Hello, world</h1>;
root.render(element);


//** when we pass the react element, react check it against what it is inside root and change that only, efficently.
// So we can directly render at any level. 

//React elements are immutable. Once you create an element, you can’t change its children or attributes. 
//An element is like a single frame in a movie: it represents the UI at a certain point in time.
//With our knowledge so far, the only way to update the UI is to create a new element, and pass it to root.render().
//React DOM compares the element and its children to the previous one, and only applies the DOM updates necessary to bring the DOM to the desired state.
//Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
//functions and classes

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

//However, elements can also represent user-defined components:

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <Welcome name="Sara" />;
root.render(element);

//Componts can be composed using other componets or functions 
//All React components must act like pure functions (do not edit properties of arguments) with respect to their props.
/*
class let us encapsulate the behaviour and call render once 
here we use lifecycle events componentDidMount, componentWillUnmount to setup a timer that updates state 
via this.setState({ date: new Date() }); - state is a map. When state change, class rerender ( we must use setState(..) to 
rerender).
The only place where you can assign this.state is the constructor.

*/
class Clock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }
  
    componentDidMount() {
        //setup timer 
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
      // this trigger render  
      this.setState({
        date: new Date()
      });
    }
  
    render() {
      return (
        <div>
          <h1>Hello, world!</h1>
          <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        </div>
      );
    }
  }
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Clock />);


//React may batch multiple setState() calls into a single update for performance.
//Because this.props and this.state may be updated asynchronously, you should not rely on their values for calculating the next state.
//To fix it, use a second form of setState() that accepts a function rather than an object. That function will receive the previous state as the first argument, and the props at the time the update is applied as the second argument:
// Correct
// using the function to set state will give you new props object 
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));

// Correct
this.setState(function(state, props) {
    return {
      counter: state.counter + props.increment
    };
  });

  //set state can have multiple key values 
  //A component may choose to pass its state down as props to its child components:, else it can't be accessed 


  //Event handling 
  //JSX passes the function to event 
<button onClick={activateLasers}>
  Activate Lasers
</button>

/*
Another difference is that you cannot return false to prevent default behavior in React. You must call preventDefault explicitly. For example, with plain HTML, to prevent the default form behavior of submitting, you can write:
*/
function Form() {
    function handleSubmit(e) {
      e.preventDefault();
      console.log('You clicked submit.');
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    );
  }
 
  //When you define a component using an ES6 class, a common pattern is for an event handler to be a method on the class.
  
//Passing Arguments to Event Handlers
  <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
//In both cases, the e argument representing the React event will be passed as a second argument after the ID. 

/** Conditional Rendering - In React, you can create distinct components that encapsulate behavior you need. Then, you can render only some of them, depending on the state of your application. */

function UserGreeting(props) {
    return <h1>Welcome back!</h1>;
  }
  
  function GuestGreeting(props) {
    return <h1>Please sign up.</h1>;
  }
  
  function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
      return <UserGreeting />;
    }
    return <GuestGreeting />;
  }
  
  const root = ReactDOM.createRoot(document.getElementById('root')); 
  // Try changing to isLoggedIn={true}:
  root.render(<Greeting isLoggedIn={true} />);

  // you can also assign componet to vaiable and use it too
  button = <LogoutButton onClick={this.handleLogoutClick} />;
  //and 
  return (
    <div>
      <Greeting isLoggedIn={isLoggedIn} />
      {button}
    </div>
  );
  // more https://reactjs.org/docs/conditional-rendering.html


  //tricks
  //Rendering Multiple Components
  //You can build collections of elements and include them in JSX using curly braces {}.

  //Below, we loop through the numbers array using the JavaScript map() function. We return a <li> element for each item. Finally, we assign the resulting array of elements to listItems:
  
  const numbers = [1, 2, 3, 4, 5];
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  
  //Then, we can include the entire listItems array inside a <ul> element:
  
  <ul>{listItems}</ul>
  
// Keys should be given to the elements inside the array to give the elements a stable identity:
 // <li key={number.toString()}> </li>

  //handling froms https://reactjs.org/docs/forms.html


//https://upmostly.com/tutorials/pass-a-parameter-through-onclick-in-react
const button = <button onClick={() => sayHello('James')}>Greet</button>

//get input value 
// use onChange event with inputs and set state as name value pairs 
onInputchange(event) {
  this.setState({
    [event.target.name]: event.target.value
  });
}



// Learn about React Hooks 
//https://www.geeksforgeeks.org/introduction-to-react-hooks/?ref=lbp
//https://reactjs.org/docs/hooks-intro.html
//https://www.freecodecamp.org/news/react-hooks-fundamentals/
