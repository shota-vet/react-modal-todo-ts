// ...existing code...
import { useState } from "react";
import "./App.css";

type Todo = {
  id: number;
  text: string;
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setText(""); // 閉じたら入力をリセット（好みでOK）
  }

  function addTodo() {
    const trimmed = text.trim();
    if (!trimmed) return;
    // 空文字ならこの関数を即終了させる
    const newTodo: Todo = {
      id: Date.now(),
      text: trimmed,
    };
    // 新しいtoDoオブジェクト作成
    setTodos((prev) => [newTodo, ...prev]);
    closeModal();
  }
  // setStateに関数を取る場合コールバック関数であり、引数には最新のstateの値を入れる。今回todosは配列なので、ここではスプレッド構文により配列を展開している。スプレッド使わないと新しい配列の中にtodos配列が一つのindexとして入る感じになってしまう。再レンダリング時に更新されるから例えばsetTodos((prev) => [newTodo, ...prev]);この直後にconsole.logでstate表示させても変更前。

  return (
    <div className="container">
      <h1>Shota's Todo list</h1>

      <button className="addButton" onClick={openModal}>
        Add the list here
      </button>

      {/* Todo List　条件演算子使っている */}
      <ul className="todoList">
        {todos.length === 0 ? (
          <li className="todoEmpty">No todos yet</li>
        ) : (
          todos.map((todo) => <li key={todo.id}>{todo.text}</li>)
        )}
        {/* 再レンダリングで毎回mapで新しい配列を作り直している、mapが返すのは配列だけどreactはjsxで書くことでレンダリング時にひとつずつ展開して描写してくれる。	JSXのlistはオブジェクト扱い（{todo.text} はvalueキーではない、childrenとして渡される、タグの中身＝children
Reactが自動描画）*/}
      </ul>
      {/*()で囲んでグルーピングしないと特に改行したらバグる*/}
      {/* Fake Modal (まずはdivで理解する) */}
      {isOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          {/* 背景の黒い部分全体、その中にmodal contentを表示させてるイメージ、stopPropagationでこの子レベルでclick event止めている。onClick={(e) => e.stopPropagation()}がないと下に書いているbuttonのonClick={addTodo}onClick={closeModal}が作動しない場合でも親(modalOverlayのdiv)にクリックが伝わり、onClick={closeModal}が実行され、クリックしただけでモーダルが閉じられてしまう */}
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>Add Todo</h2>

            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Whatever you want"
            />
            {/* onChangeはそのタグ内（今回はinput）での変更イベントを拾う。入力されてinput.valueが変更されることでchangeイベントが発生。そのイベント自体をeというnewクラスのように捉えてその中のtargetキー(onChangeの型にその項目がある）がそのイベントが起きた要素で、その中のvalueがinputした内容だからこのように書く */}

            <div className="actions">
              <button className="btn primary" onClick={addTodo}>
                Add
              </button>
              <button className="btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// 全体の流れはAddする場合、Add buttonクリック→addTodo実行→state変更予約(setState)→Reactが再レンダリング→UI
