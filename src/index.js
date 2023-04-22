import MarkdownIt from "markdown-it";
const md = new MarkdownIt();

function removeWhitespace(string) {
  return string.replace(/[\r\n]+/g, "\n").replace(/[ \t]+/g, " ");
}

async function formDataToJson(req) {
  const formData = new URLSearchParams(await req.text());
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

const test_types = [
  "Jest React Test Renderer",
  "Cypress Component Test",
  "Jest Node",
];

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    if (req.method === "GET") {
      const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GPT Test Generator</title>
        <style>
          .spinner {
            display: none;
            border: 6px solid #f3f3f3;
            border-top: 6px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          #timer-message {
            display: none;
          }
        </style>
        <script>
          let timer = null;
          let timerCounter = 0;
    
          function updateTimer() {
            timerCounter++;
            const timerElement = document.getElementById('timer');
            timerElement.textContent = timerCounter;
    
            if (timerCounter >= 50) {
              timerElement.style.color = 'red';
            } else if (timerCounter >= 30) {
              timerElement.style.color = 'orange';
            } else if (timerCounter >= 10) {
              timerElement.style.color = 'black';
            } else {
              timerElement.style.color = 'green';
            }
          }
    
          function onSubmit(event) {
            event.preventDefault();
            const submitButton = document.getElementById('submit-button');
            const spinner = document.getElementById('spinner');
            const timerMessage = document.getElementById('timer-message');
            submitButton.disabled = true;
            spinner.style.display = 'inline-block';
            timerMessage.style.display = 'inline';
    
            timer = setInterval(updateTimer, 1000);
    
            event.target.submit();
          }
        </script>
      </head>
      <body>
        <h1>GPT Test Generator</h1>
        <form action="/" method="POST" onsubmit="onSubmit(event)">
          <label for="test_type">Select test type:</label>
          <select name="test_type" id="test_type">
            ${test_types.map((test_type) => {
              return `<option value="${test_type}">${test_type}</option>`;
            })}
          </select>
          <br><br>
          <label for="stringified_code">Paste your code here:</label><br>
          <textarea name="stringified_code" id="stringified_code" rows="10" cols="50"></textarea>
          <br><br>
          <button type="submit" id="submit-button">Generate Test</button>
          <div id="spinner" class="spinner"></div>
          <div id="timer-message">
            Sending request to OpenAI, waiting <span id="timer" style="color: green;">0</span> seconds so far.
          </div>
        </form>
        <p>Created by Matt Groff, his website is <a href="https://groff.dev" target="_blank">https://groff.dev</a></p>
      </body>
      </html>
    `;

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    if (req.method === "POST") {
      try {
        const { stringified_code, test_type } = await formDataToJson(req);

        if (!stringified_code || !test_type) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Missing required parameters.",
            }),
            { status: 400 }
          );
        }

        if (test_types.find((type) => type === test_type) === undefined) {
          return new Response(
            JSON.stringify({
              success: false,
              message: `Invalid test type. Valid test types are: ${test_types.join(
                ", "
              )}.`,
            }),
            { status: 400 }
          );
        }

        const cleaned_code = removeWhitespace(stringified_code);

        const test_type_examples = {
          "Jest React Test Renderer": `
            
            Jest React Test Renderer: Write tests using Jest and React Test Renderer for React components.
                
            Example:
            import TestRenderer from 'react-test-renderer';

            function MyComponent() {
              return (
                <div>
                  <SubComponent foo="bar" />
                  <p className="my">Hello</p>
                </div>
              )
            }
            
            function SubComponent() {
              return (
                <p className="sub">Sub</p>
              );
            }
            
            const testRenderer = TestRenderer.create(<MyComponent />);
            const testInstance = testRenderer.root;
            
            expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
            expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);

            More docs:
            TestRenderer
            TestRenderer.create()
            TestRenderer.act()
            TestRenderer instance
            testRenderer.toJSON()
            testRenderer.toTree()
            testRenderer.update()
            testRenderer.unmount()
            testRenderer.getInstance()
            testRenderer.root
            TestInstance
            testInstance.find()
            testInstance.findByType()
            testInstance.findByProps()
            testInstance.findAll()
            testInstance.findAllByType()
            testInstance.findAllByProps()
            testInstance.instance
            testInstance.type
            testInstance.props
            testInstance.parent
            testInstance.children
          `,
          "Cypress Component Test": `
            Cypress Component Test: Write tests using Cypress Component for testing React components in a browser-like environment.
              
            Example:
            import Button from './Button'

            it('uses custom text for the button label', () => {
              cy.mount(<Button>Click me!</Button>)
              cy.get('button').should('contains.text', 'Click me!')
            })

            More examples:
            Mounting a Component
            The first step in testing a component is to mount it. This renders the component into a testbed and enable's the use of the Cypress API to select elements, interact with them, and run assertions.

            To mount a React component, import the component into your spec and pass the component to the cy.mount command:

            import { Stepper } from './stepper'

            it('mounts', () => {
              cy.mount(<Stepper />)
              //Stepper should have initial count of 0 (default)
              cy.get('[data-cy=counter]').should('have.text', '0')
            })

            Passing Data to a Component
            You can pass props to a component by setting them on the JSX passed into cy.mount():

            it('mounts', () => {
              cy.mount(<Stepper initial={100} />)
              //Stepper should have initial count of 100
              cy.get('[data-cy=counter]').should('have.text', '100')
            })

            Testing Event Handlers
            Pass a Cypress spy to an event prop and validate it was called:

            it('clicking + fires a change event with the incremented value', () => {
              const onChangeSpy = cy.spy().as('onChangeSpy')
              cy.mount(<Stepper onChange={onChangeSpy} />)
              cy.get('[data-cy=increment]').click()
              cy.get('@onChangeSpy').should('have.been.calledWith', 1)
            })

            Testing with routerProps
            import { Navigation } from './Navigation'

            it('home link should be active when url is "/"', () => {
              // No need to pass in custom initialEntries as default url is '/'
              cy.mount(<Navigation />)

              cy.get('a').contains('Home').should('have.class', 'active')
            })

            it('login link should be active when url is "/login"', () => {
              cy.mount(<Navigation />, {
                routerProps: {
                  initialEntries: ['/login'],
                },
              })

              cy.get('a').contains('Login').should('have.class', 'active')
            })
          `,
          "Jest Node": `
            Jest Node: Write tests using Jest for testing Node.js applications.
              
            Example:
            test('adds 1 + 2 to equal 3', () => {
              expect(sum(1, 2)).toBe(3);
            });

            More examples:
            const mathOperations = require('../src/calculator');

            describe("Calculator Tests", () => {
            test("Addition of 2 numbers", () => {
            // arrange and act
            var result = mathOperations.sum(1,2)

            // assert
            expect(result).toBe(3);
            });

            test("Subtraction of 2 numbers", () => {
            // arrange and act
            var result = mathOperations.diff(10,2)

            // assert
            expect(result).toBe(8);
            });

            test("Multiplication of 2 numbers", () => {
            // arrange and act
            var result = mathOperations.product(2,8)

            // assert
            expect(result).toBe(16);
            });

            test("Division of 2 numbers", () => {
            // arrange and act
            var result = mathOperations.divide(24,8)

            // assert
            expect(result).toBe(3);
            });
            })
          `,
        };

        const test_type_example = removeWhitespace(
          test_type_examples[test_type]
        );

        const body = {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an AI code assistant specialized in generating test cases for JavaScript or Typescript code. Please generate appropriate test cases based on the given code and test type. The selected test type is: ${test_type}\n\n${test_type_example}.`,
            },
            {
              role: "user",
              content: `Code:\n${cleaned_code}\n`,
            },
          ],
          temperature: 0.7,
        };

        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        const data = await response.json();

        if (data?.error) {
          console.error(data.error?.message);

          const apiErrorTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Error - GPT Test Generator</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: red; }
              </style>
            </head>
            <body>
              <h1>Error</h1>
              <p>${
                data.error?.message || "Error communicating with GPT API."
              }</p>
            </body>
            </html>
          `;

          return new Response(apiErrorTemplate, {
            status: 500,
            headers: { "Content-Type": "text/html" },
          });
        }

        const gpt4_response = data.choices[0].message.content.trim();
        const html = md.render(gpt4_response);

        const template = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GPT Test Generator Results</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              pre { background-color: #f0f0f0; padding: 16px; overflow-x: auto; white-space: pre-wrap; }
              .copy-button { display: inline-block; background-color: #4CAF50; color: white; padding: 8px 16px; cursor: pointer; }
            </style>
            <script>
              function copyToClipboard() {
                const codeBlock = document.getElementById('generated-code');
                const range = document.createRange();
                range.selectNode(codeBlock);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
                alert('Code copied to clipboard!');
              }
            </script>
          </head>
          <body>
            <h1>Generated Test Cases</h1>
            <button class="copy-button" onclick="copyToClipboard()">Copy to Clipboard</button>
            <pre id="generated-code">${html}</pre>
            <p>Created by Matt Groff, his website is <a href="https://groff.dev" target="_blank">https://groff.dev</a></p>
          </body>
          </html>
        `;

        return new Response(template, {
          status: 200,
          headers: { "Content-Type": "text/html" },
        });
      } catch (error) {
        console.error(error);

        const errorTemplate = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error - GPT Test Generator</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { color: red; }
            </style>
          </head>
          <body>
            <h1>Error</h1>
            <p>Error communicating with GPT API.</p>
          </body>
          </html>
        `;

        return new Response(errorTemplate, {
          status: 500,
          headers: { "Content-Type": "text/html" },
        });
      }
    } else {
      return new Response("Not found", { status: 404 });
    }
  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log(`Listening on http://localhost:${server.port}...`);
