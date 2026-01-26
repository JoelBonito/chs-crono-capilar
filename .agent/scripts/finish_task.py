#!/usr/bin/env python3
import sys
import re
from pathlib import Path
import datetime

def find_backlog_file(root_path: Path) -> Path | None:
    """Procura pelo arquivo de backlog."""
    candidates = [
        root_path / "docs" / "BACKLOG.md",
        root_path / "BACKLOG.md",
        root_path / "docs" / "planning" / "BACKLOG.md"
    ]
    for path in candidates:
        if path.exists():
            return path
    return None

def mark_task_complete(backlog_path: Path, task_id: str) -> tuple[bool, str]:
    """Marca uma tarefa como concluída no backlog."""
    try:
        content = backlog_path.read_text(encoding="utf-8")
    except Exception as e:
        return False, f"Erro ao ler o arquivo: {e}"

    # Regex flexível para IDs (ex: "3.1", "Story 3.1", "Epic 1")
    # Tenta casar: "- [ ] **Story {task_id}:" ou "- [ ] **{task_id}:"
    # O task_id pode vir como "3.1" ou "Story 3.1". Vamos limpar.
    
    clean_id = task_id.lower().replace("story", "").replace("epic", "").strip()
    
    # Padrões para tentar encontrar a task
    # 1. "- [ ] **Story 3.1:**"
    # 2. "- [ ] **Epic 1:**"
    # 3. "- [ ] 3.1:"
    
    patterns = [
        # Match exato de Story/Epic com ID
        (rf"(-\s*\[)\s*(\]\s*\*\*(?:Story|Epic)\s+{re.escape(clean_id)}:)", r"\1x\2"),
        # Match apenas do ID (caso o usuário mande "3.1" e no texto esteja "**3.1:**")
        (rf"(-\s*\[)\s*(\]\s*\*\*{re.escape(clean_id)}:)", r"\1x\2"),
    ]

    new_content = content
    found = False

    for pattern, replacement in patterns:
        # Verifica se existe antes de substituir para saber se achou
        if re.search(pattern, new_content, re.IGNORECASE):
            new_content = re.sub(pattern, replacement, new_content, flags=re.IGNORECASE)
            found = True
            # Se achou e substituiu, para (assume IDs únicos ou substitui todos se repetido, 
            # mas o break aqui é para não aplicar múltiplos patterns na mesma linha se eles se sobreporem)
            # Na verdade, re.sub substitui todas as ocorrências.
            break

    if not found:
        return False, f"Tarefa '{task_id}' não encontrada ou já concluída."

    try:
        backlog_path.write_text(new_content, encoding="utf-8")
        return True, f"Tarefa '{task_id}' marcada como concluída em {backlog_path.name}."
    except Exception as e:
        return False, f"Erro ao salvar arquivo: {e}"

def main():
    if len(sys.argv) < 2:
        print("❌ Uso: python finish_task.py <TASK_ID>")
        print("Exemplo: python finish_task.py '3.1'")
        sys.exit(1)

    task_id = sys.argv[1]
    root = Path.cwd()
    
    backlog_file = find_backlog_file(root)
    if not backlog_file:
        print("❌ Arquivo BACKLOG.md não encontrado em ./docs ou ./docs/planning")
        sys.exit(1)

    success, message = mark_task_complete(backlog_file, task_id)
    
    if success:
        print(f"✅ {message}")
        # Opcional: Trigger logic could go here (e.g., run progress tracker)
    else:
        print(f"⚠️ {message}")
        sys.exit(1)

if __name__ == "__main__":
    main()
