import React, { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";

interface QuestionData {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string[];
}

interface Props {
  questionData: QuestionData;
  onScoreUpdate: (delta: number, filled: (string | null)[]) => void;
  onAnswerChange: (filled: (string | null)[]) => void;
  initialFilled: (string | null)[];
}

const DraggableOption = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded cursor-pointer text-sm"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {id}
    </div>
  );
};

const DroppableBlank = ({
  id,
  filled,
  onClick,
}: {
  id: string;
  filled: string | null;
  onClick: () => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <span
      ref={setNodeRef}
      onClick={onClick}
      className={`inline-block min-w-[100px] border-b-2 mx-1 px-2 cursor-pointer transition ${
        filled ? "text-blue-600 border-blue-400" : "border-gray-300"
      } ${isOver ? "bg-yellow-100" : ""}`}
    >
      {filled ?? "____________"}
    </span>
  );
};

const QuestionCard: React.FC<Props> = ({
  questionData,
  onScoreUpdate,
  onAnswerChange,
  initialFilled,
}) => {
  const blanks = questionData.correctAnswer.length;

  const [filled, setFilled] = useState<(string | null)[]>([]);
  const [remainingOptions, setRemainingOptions] = useState<string[]>([]);

  useEffect(() => {
    // Reset state when questionData changes
    const validFilled =
      initialFilled.length === blanks ? initialFilled : Array(blanks).fill(null);

    setFilled(validFilled);
    setRemainingOptions(
      questionData.options.filter((opt) => !validFilled.includes(opt))
    );
  }, [questionData, initialFilled]);

  const handleRemove = (index: number) => {
    const removed = filled[index];
    if (!removed) return;

    setRemainingOptions((prev) => [...prev, removed]);
    setFilled((prev) => {
      const newArr = [...prev];
      newArr[index] = null;
      onAnswerChange(newArr);
      return newArr;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const option = event.active.id.toString();
    const target = event.over?.id?.toString();

    if (!target || !target.startsWith("blank-")) return;

    const index = parseInt(target.split("-")[1]);
    if (filled[index]) return;

    setFilled((prev) => {
      const newArr = [...prev];
      newArr[index] = option;
      onAnswerChange(newArr);
      return newArr;
    });

    setRemainingOptions((prev) => prev.filter((opt) => opt !== option));
  };

  useEffect(() => {
    const isComplete = filled.every((v) => v !== null);
    if (isComplete) {
      const score = filled.reduce((acc, val, i) => {
        return acc + (val === questionData.correctAnswer[i] ? 1 : 0);
      }, 0);
      onScoreUpdate(score, filled);
    }
  }, [filled]);

  const parts = questionData.question.split("_____________");

  return (
    <div className="border rounded-xl p-4 mb-6 shadow-md bg-white">
      <DndContext onDragEnd={handleDragEnd}>
        <p className="text-lg mb-2 flex flex-wrap items-center gap-1">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < blanks && (
                <DroppableBlank
                  id={`blank-${i}`}
                  filled={filled[i]}
                  onClick={() => handleRemove(i)}
                />
              )}
            </span>
          ))}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {remainingOptions.map((opt) => (
            <DraggableOption key={opt} id={opt} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default QuestionCard;
