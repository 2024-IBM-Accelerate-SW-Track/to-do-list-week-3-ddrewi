import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  const taskName = "Test";
  const dueDate1 = "11/24/2024";
  const dueDate2 = "11/30/2024";

  fireEvent.change(inputTask, { target: { value: taskName}});
  fireEvent.change(inputDate, { target: { value: dueDate1}});
  fireEvent.click(element);

  const check = screen.getByText(/Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate1, "i"));
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();

  fireEvent.change(inputTask, { target: { value: taskName}});
  fireEvent.change(inputDate, { target: { value: dueDate2}});
  fireEvent.click(element);

  const duplicateCheck = screen.getByText(/Test/i);
  expect(duplicateCheck).toBeInTheDocument();
 });

 
 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
 
  const dueDate = "11/24/2024";

  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  expect(() => screen.getByText(/""/i)).toThrow();
 });


 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
 
  const taskName = "Test";

  fireEvent.change(inputTask, { target: { value: taskName}});
  fireEvent.click(element);

  expect(() => screen.getByText(/Test/i)).toThrow();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  const taskName = "Test";
  const dueDate = "11/24/2024";

  fireEvent.change(inputTask, { target: { value: taskName}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  const check = screen.getByText(/Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  expect(() => screen.getByText(/Test/i)).toThrow();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  const taskName1 = "Test1";
  const dueDate1 = "11/24/2024";
  const taskName2 = "Test2";
  const dueDate2 = "11/24/2023";

  fireEvent.change(inputTask, { target: { value: taskName1}});
  fireEvent.change(inputDate, { target: { value: dueDate1}});
  fireEvent.click(element);
  fireEvent.change(inputTask, { target: { value: taskName2}});
  fireEvent.change(inputDate, { target: { value: dueDate2}});
  fireEvent.click(element);

  const check1 = screen.getByText(/Test1/i);
  const checkDate1 = screen.getByText(new RegExp(dueDate1, "i"));
  expect(check1).toBeInTheDocument();
  expect(checkDate1).toBeInTheDocument();

  const check2 = screen.getByText(/Test2/i);
  const checkDate2 = screen.getByText(new RegExp(dueDate2, "i"));
  expect(check2).toBeInTheDocument();
  expect(checkDate2).toBeInTheDocument();

  const beforeDueCheck = screen.getByTestId(/Test1/i).style.backgroundColor;
  const overDueCheck = screen.getByTestId(/Test2/i).style.backgroundColor;

  expect(beforeDueCheck).toBe("white");
  expect(overDueCheck).toBe("IndianRed");
 });
