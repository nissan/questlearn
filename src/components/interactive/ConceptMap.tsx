// Based on Cogniti Interactive. Refactored for QuestLearn.
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Concept {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Connection {
  id: string;
  source: string;
  target: string;
  relationship: string;
}

interface ConceptMapProps {
  topic: string;
}

const STARTER_CONCEPTS: Record<string, string[]> = {
  default: ['Main Concept', 'Key Idea 1', 'Key Idea 2', 'Supporting Detail'],
};

function getStarterConcepts(topic: string): string[] {
  return STARTER_CONCEPTS[topic.toLowerCase()] ?? [topic, 'Concept 1', 'Concept 2', 'Concept 3'];
}

let idCounter = 100;
function genId() { return `n${++idCounter}`; }

const CANVAS_W = 800;
const CANVAS_H = 520;

export function ConceptMap({ topic }: ConceptMapProps) {
  const starters = getStarterConcepts(topic);
  const [concepts, setConcepts] = useState<Concept[]>(() => starters.map((label, i) => ({
    id: genId(),
    label,
    x: 100 + (i % 2) * 300,
    y: 80 + Math.floor(i / 2) * 200,
  })));
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [pendingConnection, setPendingConnection] = useState<{ source: string; target: string } | null>(null);
  const [relationshipInput, setRelationshipInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mapFeedback, setMapFeedback] = useState<string | null>(null);
  const [suggestedConnection, setSuggestedConnection] = useState<{ source: string; target: string; relationship: string } | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingMapFeedback, setLoadingMapFeedback] = useState(false);
  const [newConceptLabel, setNewConceptLabel] = useState('');
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getConceptById = useCallback((id: string) => concepts.find(c => c.id === id), [concepts]);

  // ── Drag handling ─────────────────────────────────────────────────────────
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    if (connecting) {
      // If connecting mode, clicking a node completes the connection
      if (connecting !== id) {
        setPendingConnection({ source: connecting, target: id });
        setConnecting(null);
      } else {
        setConnecting(null);
      }
      return;
    }
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const concept = concepts.find(c => c.id === id);
    if (!concept) return;
    setSelected(id);
    setDragging({ id, offsetX: e.clientX - rect.left - concept.x, offsetY: e.clientY - rect.top - concept.y });
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = Math.max(60, Math.min(CANVAS_W - 60, e.clientX - rect.left - dragging.offsetX));
      const y = Math.max(30, Math.min(CANVAS_H - 30, e.clientY - rect.top - dragging.offsetY));
      setConcepts(cs => cs.map(c => c.id === dragging.id ? { ...c, x, y } : c));
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [dragging]);

  // ── Add concept ───────────────────────────────────────────────────────────
  const handleAddConcept = () => {
    if (!newConceptLabel.trim()) return;
    setConcepts(cs => [...cs, {
      id: genId(),
      label: newConceptLabel.trim(),
      x: 100 + Math.random() * 400,
      y: 80 + Math.random() * 300,
    }]);
    setNewConceptLabel('');
  };

  // ── Add connection after relationship input ───────────────────────────────
  const handleAddConnection = useCallback(async () => {
    if (!pendingConnection || !relationshipInput.trim()) return;
    const src = getConceptById(pendingConnection.source);
    const tgt = getConceptById(pendingConnection.target);
    if (!src || !tgt) return;

    const newConn: Connection = {
      id: genId(),
      source: pendingConnection.source,
      target: pendingConnection.target,
      relationship: relationshipInput.trim(),
    };
    setConnections(cs => [...cs, newConn]);
    setRelationshipInput('');
    setPendingConnection(null);
    setFeedback(null);
    setLoadingFeedback(true);

    try {
      const res = await fetch('/api/questlearn/concept-map/evaluate-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          source_concept: src.label,
          target_concept: tgt.label,
          relationship: newConn.relationship,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      setFeedback("Great connection! Keep building your map.");
    } finally {
      setLoadingFeedback(false);
    }
  }, [pendingConnection, relationshipInput, getConceptById, topic]);

  // ── Evaluate full map ─────────────────────────────────────────────────────
  const handleEvaluateMap = async () => {
    setLoadingMapFeedback(true);
    setMapFeedback(null);
    setSuggestedConnection(null);

    try {
      const res = await fetch('/api/questlearn/concept-map/evaluate-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          concepts: concepts.map(c => c.label),
          connections: connections.map(c => ({
            source: getConceptById(c.source)?.label ?? c.source,
            target: getConceptById(c.target)?.label ?? c.target,
            relationship: c.relationship,
          })),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMapFeedback(data.feedback);
      setSuggestedConnection(data.suggestedConnection);
    } catch {
      setMapFeedback("Your map is looking great! Keep adding more connections to deepen your understanding.");
    } finally {
      setLoadingMapFeedback(false);
    }
  };

  const srcConcept = pendingConnection ? getConceptById(pendingConnection.source) : null;
  const tgtConcept = pendingConnection ? getConceptById(pendingConnection.target) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Concept Map</span>
        <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-0">Visual Learning</Badge>
        <span className="text-xs text-muted-foreground ml-auto">{connections.length} connections</span>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 border-b flex items-center gap-2 shrink-0 flex-wrap">
        <input
          className="text-xs px-2 py-1.5 rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36"
          placeholder="Add concept…"
          value={newConceptLabel}
          onChange={e => setNewConceptLabel(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAddConcept(); }}
        />
        <Button size="sm" variant="outline" className="text-xs h-7" onClick={handleAddConcept}>+ Add</Button>
        <Button
          size="sm"
          variant={connecting ? 'default' : 'outline'}
          className="text-xs h-7"
          onClick={() => { setConnecting(selected); setFeedback(null); }}
          disabled={!selected || !!connecting}
        >
          {connecting ? '⚡ Click target…' : '🔗 Connect'}
        </Button>
        {connecting && (
          <Button size="sm" variant="ghost" className="text-xs h-7 text-muted-foreground" onClick={() => setConnecting(null)}>
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 ml-auto"
          onClick={handleEvaluateMap}
          disabled={loadingMapFeedback || connections.length === 0}
        >
          {loadingMapFeedback ? 'Evaluating…' : '🧠 Evaluate Map'}
        </Button>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 relative overflow-hidden bg-muted/20">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          className="cursor-default"
          onClick={() => { if (!dragging && !connecting) setSelected(null); }}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#6b7280" />
            </marker>
          </defs>

          {/* Connection lines */}
          {connections.map(conn => {
            const src = getConceptById(conn.source);
            const tgt = getConceptById(conn.target);
            if (!src || !tgt) return null;
            const mx = (src.x + tgt.x) / 2;
            const my = (src.y + tgt.y) / 2;
            return (
              <g key={conn.id}>
                <line
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke="#6b7280" strokeWidth="1.5"
                  markerEnd="url(#arrow)"
                />
                <rect x={mx - 40} y={my - 12} width={80} height={20} rx={4} fill="#1f2937" stroke="#374151" strokeWidth="1" />
                <text x={mx} y={my + 4} textAnchor="middle" fontSize="10" fill="#9ca3af" className="select-none">
                  {conn.relationship.length > 12 ? conn.relationship.slice(0, 11) + '…' : conn.relationship}
                </text>
              </g>
            );
          })}

          {/* Concept nodes */}
          {concepts.map(concept => (
            <g key={concept.id} onMouseDown={e => handleNodeMouseDown(e, concept.id)} style={{ cursor: 'grab' }}>
              <ellipse
                cx={concept.x} cy={concept.y} rx={70} ry={26}
                fill={selected === concept.id ? '#064e3b' : '#111827'}
                stroke={selected === concept.id ? '#10b981' : connecting === concept.id ? '#a78bfa' : '#374151'}
                strokeWidth={selected === concept.id || connecting === concept.id ? 2 : 1}
              />
              <text x={concept.x} y={concept.y + 5} textAnchor="middle" fontSize="12" fill="#f3f4f6" className="select-none pointer-events-none">
                {concept.label.length > 14 ? concept.label.slice(0, 13) + '…' : concept.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Relationship input dialog */}
      {pendingConnection && (
        <div className="px-4 py-3 border-t bg-emerald-500/5 shrink-0">
          <p className="text-xs text-muted-foreground mb-2">
            Label the connection: <strong>{srcConcept?.label}</strong> → <strong>{tgtConcept?.label}</strong>
          </p>
          <div className="flex gap-2">
            <input
              className="flex-1 text-sm px-3 py-1.5 rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. causes, produces, requires…"
              value={relationshipInput}
              autoFocus
              onChange={e => setRelationshipInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddConnection(); if (e.key === 'Escape') setPendingConnection(null); }}
            />
            <Button size="sm" onClick={handleAddConnection} disabled={!relationshipInput.trim()}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setPendingConnection(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* AI Feedback panels */}
      {(feedback || loadingFeedback) && (
        <div className="px-4 py-3 border-t bg-emerald-500/5 shrink-0">
          <p className="text-xs font-semibold text-emerald-400 mb-1">Connection Feedback 🤖</p>
          <p className="text-sm leading-relaxed">
            {loadingFeedback ? <span className="text-muted-foreground animate-pulse">Evaluating your connection…</span> : feedback}
          </p>
        </div>
      )}

      {(mapFeedback || loadingMapFeedback) && (
        <div className="px-4 py-3 border-t bg-blue-500/5 shrink-0">
          <p className="text-xs font-semibold text-blue-400 mb-1">Map Evaluation 🧠</p>
          {loadingMapFeedback
            ? <p className="text-sm text-muted-foreground animate-pulse">Evaluating your map…</p>
            : (
              <div className="space-y-2">
                <p className="text-sm leading-relaxed">{mapFeedback}</p>
                {suggestedConnection && (
                  <div className="text-xs text-blue-400 bg-blue-500/10 rounded px-3 py-2">
                    💡 Suggested connection: <strong>{suggestedConnection.source}</strong> → [{suggestedConnection.relationship}] → <strong>{suggestedConnection.target}</strong>
                  </div>
                )}
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}
