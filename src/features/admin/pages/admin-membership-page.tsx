import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { membershipService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'

interface CardData {
  id: string
  eyebrow: string
  name: string
  price: string
  prefix?: string
  period: string
  description: string
  features: string[]
  highlight?: boolean
  badge?: string
  availability?: boolean
  cta: string
}

interface TabData {
  id: string
  label: string
  subtitle: string
  mode: 'grid' | 'single'
  cards?: CardData[]
  single?: {
    eyebrow: string
    name: string
    price: string
    period: string
    description: string
    badge: string
    subtitle: string
    features: string[]
  }
}

const emptyForm = {
  tabs: [] as TabData[],
}

let cardIdCounter = Date.now()
function genId() {
  return `card_${cardIdCounter++}`
}

export function AdminMembershipPage() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    membershipService
      .get()
      .then((data) => {
        if (data) {
          setForm({ tabs: (data.tabs as TabData[]) ?? [] })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await membershipService.upsert({ tabs: form.tabs })
      showToast('Membership content saved!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
    setSaving(false)
  }

  const updateTab = (i: number, patch: Partial<TabData>) => {
    setForm((f) => ({
      ...f,
      tabs: f.tabs.map((t, idx) => (idx === i ? { ...t, ...patch } : t)),
    }))
  }

  const removeTab = (i: number) => {
    setForm((f) => ({ ...f, tabs: f.tabs.filter((_, idx) => idx !== i) }))
  }

  const addTab = (mode: 'grid' | 'single' = 'grid') => {
    const tab: any = { id: genId(), label: '', subtitle: '', mode }
    if (mode === 'grid') tab.cards = []
    if (mode === 'single') {
      tab.single = {
        eyebrow: '',
        name: '',
        price: '',
        period: '',
        description: '',
        badge: '',
        subtitle: '',
        features: [],
      }
    }
    setForm((f) => ({ ...f, tabs: [...f.tabs, tab] }))
  }

  const addCard = (tabIdx: number) => {
    setForm((f) => ({
      ...f,
      tabs: f.tabs.map((t, i) =>
        i === tabIdx
          ? {
              ...t,
              cards: [
                ...(t.cards || []),
                {
                  id: genId(),
                  eyebrow: '',
                  name: '',
                  price: '',
                  period: '',
                  description: '',
                  features: [],
                  cta: '',
                },
              ],
            }
          : t
      ),
    }))
  }

  const updateCard = (
    tabIdx: number,
    cardIdx: number,
    patch: Partial<CardData>
  ) => {
    setForm((f) => ({
      ...f,
      tabs: f.tabs.map((t, i) =>
        i === tabIdx
          ? {
              ...t,
              cards: t.cards?.map((c, j) =>
                j === cardIdx ? { ...c, ...patch } : c
              ),
            }
          : t
      ),
    }))
  }

  const removeCard = (tabIdx: number, cardIdx: number) => {
    setForm((f) => ({
      ...f,
      tabs: f.tabs.map((t, i) =>
        i === tabIdx
          ? { ...t, cards: t.cards?.filter((_, j) => j !== cardIdx) }
          : t
      ),
    }))
  }

  const addFeature = (tabIdx: number, cardIdx: number) => {
    setForm((f) => ({
      ...f,
      tabs: f.tabs.map((t, i) =>
        i === tabIdx
          ? {
              ...t,
              cards: t.cards?.map((c, j) =>
                j === cardIdx ? { ...c, features: [...c.features, ''] } : c
              ),
            }
          : t
      ),
    }))
  }

  const updateFeature = (
    tabIdx: number,
    cardIdx: number,
    featIdx: number,
    val: string
  ) => {
    setForm((f) => ({
      ...f,
      tabs: f.tabs.map((t, i) =>
        i === tabIdx
          ? {
              ...t,
              cards: t.cards?.map((c, j) =>
                j === cardIdx
                  ? {
                      ...c,
                      features: c.features.map((fv, k) =>
                        k === featIdx ? val : fv
                      ),
                    }
                  : c
              ),
            }
          : t
      ),
    }))
  }

  const removeFeature = (tabIdx: number, cardIdx: number, featIdx: number) => {
    setForm((f) => ({
      ...f,
      tabs: f.tabs.map((t, i) =>
        i === tabIdx
          ? {
              ...t,
              cards: t.cards?.map((c, j) =>
                j === cardIdx
                  ? {
                      ...c,
                      features: c.features.filter((_, k) => k !== featIdx),
                    }
                  : c
              ),
            }
          : t
      ),
    }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-rule rounded-sm animate-pulse w-48" />
        <div className="h-96 bg-rule rounded-sm animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Membership Section</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Edit plans, pricing, and tabs shown in the membership section
          </p>
        </div>
        <Button text="Save All" onClick={handleSave} disabled={saving} />
      </div>

      {form.tabs.map((tab, ti) => (
        <Card key={tab.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-h4 font-display text-fg-1">
                {tab.label || `Tab ${ti + 1}`}
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  text="Remove Tab"
                  icon={X}
                  onClick={() => removeTab(ti)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={['tab-settings', 'tab-content']}
            >
              <AccordionItem value="tab-settings">
                <AccordionTrigger>Tab Settings</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-4 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-caption text-fg-3">Tab ID</label>
                      <input
                        value={tab.id}
                        onChange={(e) => updateTab(ti, { id: e.target.value })}
                        placeholder="open-desks"
                        className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-caption text-fg-3">Label</label>
                      <input
                        value={tab.label}
                        onChange={(e) =>
                          updateTab(ti, { label: e.target.value })
                        }
                        placeholder="Open desks"
                        className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-caption text-fg-3">Subtitle</label>
                      <input
                        value={tab.subtitle}
                        onChange={(e) =>
                          updateTab(ti, { subtitle: e.target.value })
                        }
                        placeholder="DAY PASS · NPR 800 / DAY"
                        className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-caption text-fg-3">Mode</label>
                      <select
                        value={tab.mode}
                        onChange={(e) => {
                          const mode = e.target.value as 'grid' | 'single'
                          updateTab(ti, {
                            mode,
                            ...(mode === 'single' && !tab.single
                              ? {
                                  single: {
                                    eyebrow: '',
                                    name: '',
                                    price: '',
                                    period: '',
                                    description: '',
                                    badge: '',
                                    subtitle: '',
                                    features: [],
                                  },
                                }
                              : {}),
                          })
                        }}
                        className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                      >
                        <option value="grid">Grid</option>
                        <option value="single">Single</option>
                      </select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tab-content">
                <AccordionTrigger>
                  {tab.mode === 'grid'
                    ? `Cards (${tab.cards?.length || 0})`
                    : 'Content'}
                </AccordionTrigger>
                <AccordionContent>
                  {tab.mode === 'grid' && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-label text-fg-2">
                          Cards ({tab.cards?.length || 0})
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          text="Add Card"
                          icon={Plus}
                          onClick={() => addCard(ti)}
                        />
                      </div>
                      <Accordion type="multiple">
                        {tab.cards?.map((card, ci) => (
                          <AccordionItem
                            key={card.id}
                            value={`card-${ci}`}
                            className="border border-rule rounded-sm mb-3 bg-bg-raised px-0"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline">
                              <span className="text-sm font-medium text-fg-1">
                                {card.name || `Card ${ci + 1}`}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeCard(ti, ci)
                                }}
                                className="shrink-0 text-fg-3 hover:text-clay transition-colors cursor-pointer ml-auto"
                              >
                                <X size={14} />
                              </button>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="px-4 pb-4 pt-0 space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-caption text-fg-3">
                                      ID
                                    </label>
                                    <input
                                      value={card.id}
                                      onChange={(e) =>
                                        updateCard(ti, ci, {
                                          id: e.target.value,
                                        })
                                      }
                                      placeholder="day-pass"
                                      className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1 font-mono"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-caption text-fg-3">
                                      Eyebrow
                                    </label>
                                    <input
                                      value={card.eyebrow}
                                      onChange={(e) =>
                                        updateCard(ti, ci, {
                                          eyebrow: e.target.value,
                                        })
                                      }
                                      placeholder="Hot desk"
                                      className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-caption text-fg-3">
                                      Name
                                    </label>
                                    <input
                                      value={card.name}
                                      onChange={(e) =>
                                        updateCard(ti, ci, {
                                          name: e.target.value,
                                        })
                                      }
                                      placeholder="Day Pass"
                                      className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-caption text-fg-3">
                                      Price
                                    </label>
                                    <input
                                      value={card.price}
                                      onChange={(e) =>
                                        updateCard(ti, ci, {
                                          price: e.target.value,
                                        })
                                      }
                                      placeholder="800"
                                      className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-caption text-fg-3">
                                      Period
                                    </label>
                                    <input
                                      value={card.period}
                                      onChange={(e) =>
                                        updateCard(ti, ci, {
                                          period: e.target.value,
                                        })
                                      }
                                      placeholder="/ day"
                                      className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-caption text-fg-3">
                                      Prefix
                                    </label>
                                    <input
                                      value={card.prefix || ''}
                                      onChange={(e) =>
                                        updateCard(ti, ci, {
                                          prefix: e.target.value,
                                        })
                                      }
                                      placeholder="From"
                                      className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                                    />
                                  </div>
                                  <div className="space-y-1 col-span-2">
                                    <label className="text-caption text-fg-3">
                                      CTA
                                    </label>
                                    <input
                                      value={card.cta}
                                      onChange={(e) =>
                                        updateCard(ti, ci, {
                                          cta: e.target.value,
                                        })
                                      }
                                      placeholder="Start day pass"
                                      className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-caption text-fg-3">
                                      Badge
                                    </label>
                                    <input
                                      value={card.badge || ''}
                                      onChange={(e) =>
                                        updateCard(ti, ci, {
                                          badge: e.target.value,
                                        })
                                      }
                                      placeholder="Most picked"
                                      className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                                    />
                                  </div>
                                  <div className="space-y-1 col-span-2">
                                    <label className="text-caption text-fg-3">
                                      Availability
                                    </label>
                                    <label className="flex items-center gap-1.5 text-xs text-fg-2 mt-1">
                                      <input
                                        type="checkbox"
                                        checked={!!card.availability}
                                        onChange={(e) =>
                                          updateCard(ti, ci, {
                                            availability: e.target.checked,
                                          })
                                        }
                                        className="accent-clay"
                                      />
                                      Available
                                    </label>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-caption text-fg-3">
                                    Description
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={card.description}
                                    onChange={(e) =>
                                      updateCard(ti, ci, {
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="One open-room desk for the day…"
                                    className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                                  />
                                </div>
                                <div className="flex items-center gap-3">
                                  <label className="flex items-center gap-1.5 text-xs text-fg-2">
                                    <input
                                      type="checkbox"
                                      checked={!!card.highlight}
                                      onChange={(e) =>
                                        updateCard(ti, ci, {
                                          highlight: e.target.checked,
                                        })
                                      }
                                      className="accent-clay"
                                    />
                                    Highlight
                                  </label>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-caption text-fg-3">
                                      Features
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      text="+"
                                      onClick={() => addFeature(ti, ci)}
                                      className="!px-2 !py-0.5 text-xs"
                                    />
                                  </div>
                                  {card.features.map((fv, fi) => (
                                    <div key={fi} className="flex gap-2 mb-1">
                                      <input
                                        value={fv}
                                        onChange={(e) =>
                                          updateFeature(
                                            ti,
                                            ci,
                                            fi,
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g. Any open desk · any room"
                                        className="flex-1 border border-rule rounded-sm px-2 py-1 text-xs bg-transparent text-fg-1"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeFeature(ti, ci, fi)
                                        }
                                        className="text-fg-3 hover:text-clay cursor-pointer"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}

                  {tab.mode === 'single' && (
                    <div className="border border-rule rounded-sm p-4 bg-bg-raised mt-2">
                      {!tab.single ? (
                        <div className="text-sm text-fg-3 text-center py-4">
                          Add content below — save to keep
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="space-y-1">
                              <label className="text-caption text-fg-3">
                                Eyebrow
                              </label>
                              <input
                                value={tab.single.eyebrow}
                                onChange={(e) =>
                                  updateTab(ti, {
                                    single: {
                                      ...tab.single!,
                                      eyebrow: e.target.value,
                                    },
                                  })
                                }
                                placeholder="Address & mail"
                                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-caption text-fg-3">
                                Name
                              </label>
                              <input
                                value={tab.single.name}
                                onChange={(e) =>
                                  updateTab(ti, {
                                    single: {
                                      ...tab.single!,
                                      name: e.target.value,
                                    },
                                  })
                                }
                                placeholder="Virtual Office"
                                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-caption text-fg-3">
                                Price
                              </label>
                              <input
                                value={tab.single.price}
                                onChange={(e) =>
                                  updateTab(ti, {
                                    single: {
                                      ...tab.single!,
                                      price: e.target.value,
                                    },
                                  })
                                }
                                placeholder="6,000"
                                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-caption text-fg-3">
                                Period
                              </label>
                              <input
                                value={tab.single.period}
                                onChange={(e) =>
                                  updateTab(ti, {
                                    single: {
                                      ...tab.single!,
                                      period: e.target.value,
                                    },
                                  })
                                }
                                placeholder="/ month"
                                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-caption text-fg-3">
                                Badge
                              </label>
                              <input
                                value={tab.single.badge}
                                onChange={(e) =>
                                  updateTab(ti, {
                                    single: {
                                      ...tab.single!,
                                      badge: e.target.value,
                                    },
                                  })
                                }
                                placeholder="Most picked"
                                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-caption text-fg-3">
                                Subtitle
                              </label>
                              <input
                                value={tab.single.subtitle}
                                onChange={(e) =>
                                  updateTab(ti, {
                                    single: {
                                      ...tab.single!,
                                      subtitle: e.target.value,
                                    },
                                  })
                                }
                                placeholder="DAY PASS · NPR 800 / DAY"
                                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                              />
                            </div>
                          </div>
                          <div className="space-y-1 mb-3">
                            <label className="text-caption text-fg-3">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={tab.single.description}
                              onChange={(e) =>
                                updateTab(ti, {
                                  single: {
                                    ...tab.single!,
                                    description: e.target.value,
                                  },
                                })
                              }
                              placeholder="A mailing address & mail handling service…"
                              className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-caption text-fg-3">
                                Features
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                text="+"
                                onClick={() => {
                                  const s = tab.single!
                                  updateTab(ti, {
                                    single: {
                                      ...s,
                                      features: [...s.features, ''],
                                    },
                                  })
                                }}
                                className="!px-2 !py-0.5 text-xs"
                              />
                            </div>
                            {tab.single.features.map((fv, fi) => (
                              <div key={fi} className="flex gap-2 mb-1">
                                <input
                                  value={fv}
                                  onChange={(e) => {
                                    const s = tab.single!
                                    s.features[fi] = e.target.value
                                    updateTab(ti, { single: { ...s } })
                                  }}
                                  placeholder="e.g. Dedicated mailbox"
                                  className="flex-1 border border-rule rounded-sm px-2 py-1 text-xs bg-transparent text-fg-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const s = tab.single!
                                    updateTab(ti, {
                                      single: {
                                        ...s,
                                        features: s.features.filter(
                                          (_, k) => k !== fi
                                        ),
                                      },
                                    })
                                  }}
                                  className="text-fg-3 hover:text-clay cursor-pointer"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-3">
        <Button
          text="Add Grid Tab"
          icon={Plus}
          onClick={() => addTab('grid')}
          variant="outline"
        />
        <Button
          text="Add Single Tab"
          icon={Plus}
          onClick={() => addTab('single')}
          variant="outline"
        />
        <Button text="Save All" onClick={handleSave} disabled={saving} />
      </div>
    </div>
  )
}
