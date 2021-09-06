import { useEffect, useState } from 'react'
import { Button, Col, Form, ListGroup, Nav, Row, Tab, Tabs } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const initialTodos = JSON.parse(localStorage.getItem('newTodos') || '[]')

function Todos({ todos, setTodos }) {
  return (
    <ListGroup>
      {todos.map((v, i) => (
        <ListGroup.Item key={v.id}>
          {i+1}:{' '}
          {v.text}
          {v.isComplete ? (<Button onClick={() => {
            v.isComplete = false;
            setTodos([].concat(todos))
          }}>Не Сделано</Button>) : (<Button onClick={() => {
            v.isComplete = true;
            setTodos([].concat(todos))
          }}>Сделано</Button>)}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

function App() {
  const [newTodoText, setNewTodoText] = useState('')
  const [todos, setInnerTodos] = useState(initialTodos)
  useEffect(() => {
    fetch('/todos')
      .then((r) => r.json())
      .then((todos) => {
        setInnerTodos(todos)
      })
  }, [setInnerTodos])
  function setTodos(newTodos) {
    setInnerTodos(newTodos)
    localStorage.setItem('newTodos', JSON.stringify(newTodos))
  }
  return (
    <div className="App" style={{margin: '2em'}}>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Form.Label column sm="2">
            New to-do
          </Form.Label>
          <Col sm="8">
            <Form.Control placeholder="what you want to do"
                          value={newTodoText}
                          onChange={(e) => {
                            setNewTodoText(e.target.value);
                          }}/>
          </Col>
          <Button onClick={() => {
            const newTodo = {
              text: newTodoText,
              id: Math.random(),
              isComplete: false,
            }
            fetch('/todos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({...newTodo, id: null})
            })
              .then((r) => r.json())
              .then((newTodo) => {
                setNewTodoText('')
                setTodos([newTodo].concat(todos))
              })
          }}>Добавить</Button>
        </Form.Group>
      </Form>
      <Tabs defaultActiveKey="incomplete" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="incomplete" title="Не завершённые">
          <Todos todos={todos.filter((v) => !v.isComplete)} setTodos={setTodos} />
        </Tab>
        <Tab eventKey="complete" title="Завершённые">
          <Todos todos={todos.filter((v) => v.isComplete)} setTodos={setTodos} />
        </Tab>
        <Tab eventKey="all" title="Все">
          <Todos todos={todos} setTodos={setTodos} />
        </Tab>
      </Tabs>


    </div>
  );
}

export default App;
