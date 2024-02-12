# Flowist

**Flowist** is a simple webapp created by [Me (Zied)](https://github.com/ZiedDev) & [Sherbo](https://github.com/omar-elsherbiny) that lets you create FlowCharts and run them realtime. We have created this webapp to help all the students understand the basics of writing flowcharts.

## How to use? (Last updated v1.6)

### Page

When you first load up, you will be presented with this.
![](https://cdn.discordapp.com/attachments/1064471000932155434/1203768065842483230/image.png?ex=65d24b5f&is=65bfd65f&hm=faa7d4f0de20b7263ebf3fa8945ee7e73db034c43ebe58e8b41fef4e30183b92&)

## Tools

 There are 4 tools (*in the current version*) :

- **Hand** <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M188 44a32 32 0 0 0-8 1v-1a32 32 0 0 0-60.79-14A32 32 0 0 0 76 60v50.83a32 32 0 0 0-52 36.7C55.82 214.6 75.35 244 128 244a92.1 92.1 0 0 0 92-92V76a32 32 0 0 0-32-32m8 108a68.08 68.08 0 0 1-68 68c-35.83 0-49.71-14-82.48-83.14c-.14-.29-.29-.58-.45-.86a8 8 0 0 1 13.85-8l.21.35l18.68 30A12 12 0 0 0 100 152V60a8 8 0 0 1 16 0v60a12 12 0 0 0 24 0V44a8 8 0 0 1 16 0v76a12 12 0 0 0 24 0V76a8 8 0 0 1 16 0Z"/></svg> (keyboard shortcut: *Q*)

  - Lets you **move** the FlowChart block on the Board
    ![hand be dragging fr](https://cdn.discordapp.com/attachments/1064471000932155434/1203469775292858378/Handtool-ezgif.com-video-to-gif-converter.gif?ex=65d13591&is=65bec091&hm=4294370c6d783d0695c815d52554594d08e0d66696a77e9ca52d9a0d71a26501&)

    ---

- **Edit** <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M230.47 67.5a12 12 0 0 0-19.26-4.32L172.43 99l-12.68-2.72L157 83.57l35.79-38.78a12 12 0 0 0-4.32-19.26a76 76 0 0 0-99.23 98.27L31.17 174c-.22.19-.44.39-.64.6a36 36 0 0 0 50.91 50.91c.21-.2.41-.42.6-.64l50.16-58.07a76 76 0 0 0 98.27-99.3M160 148a52.1 52.1 0 0 1-25.13-6.46A12 12 0 0 0 120 144.2l-55.79 64.55a12 12 0 0 1-17-17L111.8 136a12 12 0 0 0 2.65-14.89A52 52 0 0 1 160 44h.89l-25.72 27.87a12 12 0 0 0-2.91 10.65l5.66 26.35a12 12 0 0 0 9.21 9.21l26.35 5.66a12 12 0 0 0 10.65-2.91L212 95.12v.89A52.06 52.06 0 0 1 160 148"/></svg> (keyboard shortcut: *W*)

  - Lets you **edit** the content of a FlowChart block
  - Follow the Notation to avoid unwanted behaviour during run process
   ![edit be editing fr](https://cdn.discordapp.com/attachments/1064471000932155434/1203470947915530290/EditTool-ezgif.com-video-to-gif-converter.gif?ex=65d136a9&is=65bec1a9&hm=ffb8653806fed624da7794ee450edafa9d56c42c1760a8081758a77605b95289&)

   ---

- **Connections** <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="m137 168l11.52-11.51a12 12 0 0 0-17-17L120 151l-15-15l11.52-11.51a12 12 0 0 0-17-17L88 119l-15.51-15.49a12 12 0 0 0-17 17L59 124l-20.46 20.49a36 36 0 0 0 0 50.91l2.55 2.54l-25.58 25.57a12 12 0 0 0 17 17l25.57-25.58l2.54 2.55a36.06 36.06 0 0 0 50.91 0L132 197l3.51 3.52a12 12 0 0 0 17-17Zm-42.46 32.49a12 12 0 0 1-17 0l-22.03-22.06a12 12 0 0 1 0-17L76 141l39 39Zm146-185a12 12 0 0 0-17 0l-25.6 25.6l-2.54-2.55a36.05 36.05 0 0 0-50.91 0L124 59l-3.51-3.52a12 12 0 0 0-17 17l80 80a12 12 0 0 0 17-17L197 132l20.49-20.49a36 36 0 0 0 0-50.91l-2.55-2.54l25.58-25.57a12 12 0 0 0-.03-16.98Zm-40 79L180 115l-39-39l20.49-20.49a12 12 0 0 1 17 0l22.06 22.06a12 12 0 0 1 0 17Z"/></svg> (keyboard shortcut: *E*)
  - Lets you **connect** FlowChart blocks together or **remove** already made connections
  - In **decision**, dragging in the red region lets you drag the **No** arrow and dragging in the green region lets you drag the **Yes** arrow
  - To remove an arrow just reconnect it again and it will be removed

    ![connections be connecting fr](https://cdn.discordapp.com/attachments/1064471000932155434/1204741043052875818/ConnectionsNew-ezgif.com-video-to-gif-converter.gif?ex=65d5d587&is=65c36087&hm=072c87532526a26aafebd41b084223ebe2431de3ffbfc53d0e46c3396f107723&)
   ---
- **Eraser** <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M216 204h-75l86.84-86.84a28 28 0 0 0 0-39.6l-41.41-41.37a28 28 0 0 0-39.6 0L28.19 154.82a28 28 0 0 0 0 39.6l30.06 30.07a12 12 0 0 0 8.49 3.51H216a12 12 0 0 0 0-24M163.8 53.16a4 4 0 0 1 5.66 0l41.38 41.38a4 4 0 0 1 0 5.65L160 151l-47-47ZM71.71 204l-26.55-26.55a4 4 0 0 1 0-5.65L96 121l47 47l-36 36Z"/></svg> (keyboard shortcut: *R*)
  - Lets you **erase** / **remove** a FlowChart block
  
    ![eraser be erasing fr](https://cdn.discordapp.com/attachments/1064471000932155434/1203474015159853076/Removetool-ezgif.com-video-to-gif-converter.gif?ex=65d13984&is=65bec484&hm=a3dda873bd0b00c460ea11cb99fa8efbfb4d80ed5b5a5aef96fe93550ff959cd&)

## Adding a new block

You can **add** new FlowChart block using the buttons on the **Side Bar**
![buttons be adding blocks fr](https://cdn.discordapp.com/attachments/1064471000932155434/1203478120632426556/AddblockButtons-ezgif.com-video-to-gif-converter.gif?ex=65d13d57&is=65bec857&hm=e525ea6b989680de3d974cec062bfc680847f7aaa6f029b8917a3b9c7d043417&)

## Running the FlowChart

You can **run** FlowChart script using the **run button** <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="#ffffff" d="M234.49 111.07L90.41 22.94A20 20 0 0 0 60 39.87v176.26a20 20 0 0 0 30.41 16.93l144.08-88.13a19.82 19.82 0 0 0 0-33.86M84 208.85V47.15L216.16 128Z"/></svg>

- Each block highlights when it runs  
- You can't pause the running process

  ![run be running fr](https://cdn.discordapp.com/attachments/1064471000932155434/1203769363337842819/Run_New-ezgif.com-video-to-gif-converter.gif?ex=65d24c95&is=65bfd795&hm=ae48c163fe33601746b8dcee9bb1680d9e247ed95183cdcd81c402663bebdb61&)

## Saving the current FlowChart

You can **save** the current FlowChart to your browser cache using the **save button** <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="#ffffff" d="m222.14 77.17l-43.31-43.31A19.86 19.86 0 0 0 164.69 28H48a20 20 0 0 0-20 20v160a20 20 0 0 0 20 20h160a20 20 0 0 0 20-20V91.31a19.86 19.86 0 0 0-5.86-14.14M164 204H92v-48h72Zm40 0h-16v-52a20 20 0 0 0-20-20H88a20 20 0 0 0-20 20v52H52V52h111l41 41ZM164 80a12 12 0 0 1-12 12H96a12 12 0 0 1 0-24h56a12 12 0 0 1 12 12"/></svg>

![save be saving fr](https://cdn.discordapp.com/attachments/1064471000932155434/1203769361899458610/Save_Button-ezgif.com-video-to-gif-converter.gif?ex=65d24c94&is=65bfd794&hm=301ce852a45b14d49b91a8d53d31a175f3a3d76e8d8d69a953d1f1c259180816&)

## Clear the currently saved FlowChart

You can **clear** the currently saved FlowChart using the **clear button** <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="#ffffff" d="M216 48h-36V36a28 28 0 0 0-28-28h-48a28 28 0 0 0-28 28v12H40a12 12 0 0 0 0 24h4v136a20 20 0 0 0 20 20h128a20 20 0 0 0 20-20V72h4a12 12 0 0 0 0-24M100 36a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v12h-56Zm88 168H68V72h120Zm-72-100v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0m48 0v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0"/></svg>

![clear be clearing fr](https://cdn.discordapp.com/attachments/1064471000932155434/1203769362285207634/Clear_local_storage-ezgif.com-video-to-gif-converter.gif?ex=65d24c94&is=65bfd794&hm=bc294111c1a2d8ff189111ca0f85688e05ecd787e0a267dbbe765cd85c0c8fb3&)

# Notation

Each FlowChart symbol requires to be written in a specific notation to work properly. Here are the required notations for each FlowChart symbol

- **Vanilla Javascript syntax will work**
- **Input / Output**
  - Variable names should be separated by commas `,` or semicolons `;` ie. `var1, var2` or `var1; var2`
  - Strings should be wrapped between quotes (double or single) `'string here'` `"or here"`
  - Undefined variables will be treated as 0s
  - Undefined functions will return nulls
  - Variables are case and space sensitive

- **Decision**
  - Conditions should be written in this formate `X >= 6`
 	- All conditions
      <table>
        <tr>
          <td>=</td>
          <td><></td>
          <td>AND</td>
        </tr>
        <tr>
          <td>></td>
          <td><</td>
          <td>OR</td>
        </tr>
        <tr>
          <td>>=</td>
          <td><=</td>
          <td>NOT</td>
        </tr>
      </table>

- **Process**
  - Processes can be separated by commas `,` or semicolons `;`. ie. `X <- 0; Y <- 0`
 	- All Operations

      <table>
        <tr>
          <td><- or <=</td>
          <td>Assigns value to a variable. ie. <code>X <- 1</code> or <code>X <= 1</code> </td>
        <tr>
        <tr>
          <td>+=</td>
          <td>Adds the value to the variable. ie. <code>X += 2</code> </td>
        <tr>
        <tr>
          <td>-=</td>
          <td>Subtracts the value to the variable. ie. <code>X -= 2</code> </td>
        <tr>
        <tr>
          <td>*=</td>
          <td>Multiplies the value to the variable. ie. <code>X *= 2</code> </td>
        <tr>
        <tr>
          <td>/=</td>
          <td>Divides the value to the variable. ie. <code>X /= 2</code> </td>
        <tr>
        <tr>
          <td>%=</td>
          <td>Sets the variable to Remainder of there division. ie. <code>X %= 2</code> </td>
        <tr>
        <tr>
          <td>**=</td>
          <td>Sets the variable to its value power the other value. ie. <code>X **= 2</code> </td>
        <tr>
        <tr>
          <td><<=</td>
          <td>Preforms right shifting operations on the binary representation of the variable in repetition of the given number. ie. <code>X <<= 2</code> </td>
        <tr>
        <tr>
          <td>>>=</td>
          <td>Preforms left shifting operations on the binary representation of the variable in repetition of the given number. ie. <code>X >>= 2</code> </td>
        <tr>
        <tr>
          <td>&=</td>
          <td>Operator performs bitwise <strong>AND</strong> on the two operands and assigns the result to the left operand. ie. <code>X &= 2</code> </td>
        <tr>
        <tr>
          <td>^=</td>
          <td>Operator performs bitwise <strong>XOR</strong> on the two operands and assigns the result to the left operand. ie. <code>X ^= 2</code> </td>
        <tr>
        <tr>
          <td>|=</td>
          <td>Operator performs bitwise <strong>OR</strong> on the two operands and assigns the result to the left operand. ie. <code>X |= 2</code> </td>
        <tr>
      </table>

- **Allowed Functions**
 	- Allowed Functions should be written in this format `MOD(x,y)`with the brackets as shown
  - Undefined / Unallowed functions will return nulls
 	- Current allowed functions:
   <table>
  <tr>
    <td>DIV</td>
    <td>Math.floor</td>
  </tr>
  <tr>
    <td>MOD</td>
    <td>Math.log</td>
  </tr>
  <tr>
    <td>INT</td>
    <td>Math.max</td>
  </tr>
  <tr>
    <td>Math.abs</td>
    <td>Math.min</td>
  </tr>
  <tr>
    <td>Math.acos</td>
    <td>Math.pow</td>
  </tr>
  <tr>
    <td>Math.asin</td>
    <td>Math.random</td>
  </tr>
  <tr>
    <td>Math.atan</td>
    <td>Math.round</td>
  </tr>
  <tr>
    <td>Math.atan2</td>
    <td>Math.sin</td>
  </tr>
  <tr>
    <td>Math.ceil</td>
    <td>Math.cos</td>
  </tr>
  <tr>
    <td>Math.sqrt</td>
    <td>Math.tan</td>
  </tr>
  <tr>
    <td>Math.exp</td>
  </tr>
   </table>

# Contact us?

Best way to reach us is via discord. <br>
My Discord ID: [ohzied](https://discord.com/users/484808856128585750) <br>
Sherbo's Discord ID: [sherbo2007](https://discord.com/users/618443479856447500)
