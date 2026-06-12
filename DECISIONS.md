# DECISIONS.md

## stock + available → "buyable"

I defined buyable as `available === true AND stock > 0`. Both must hold.
Overall, you can't buy something that is unavailable or doesn't have any items in stock

### Fields kept / dropped


| name, flavour, description | ✅ kept | Display |

| stock | ✅ kept | Core to purchase logic |

| available | ✅ kept | Core to purchase logic |

| weight | ✅ kept | Useful product detail, could be used for sorting, calculating price per 1 kg, etc. |

| sugar_content | ❌ dropped | No feature uses it but could be later added for additional sorting/filtering |

| last_update | ❌ dropped | Source API timestamp; we manage our own `updated_at` |


## One thing the AI got wrong

AI initially generated solid project and only after few back to back prompts with couple of errors it was working. But when it came to tests, it became harder because of some dependencies. Some of errors were, that it requires you to run "npm install" in order to run the tests, or it just won't find jest out of Docker. Then there were some OS related issues, PGSql ports for running tests weren't defined, changed the execution command itself, and some other minor errors. Then, tests were finally running but failing. Alltogether it required around 10-12 prompts to get tests to launch and pass. 


## What I cut and what's next

I made a toggle switch CHECKOUT_REQUIRES_AUTH=true but it is not yet synchronized with frontend - I ran out of tokens and time. But backend is already reading it, only need to pass it to frontend and use there. Its just I dont wanna break and fix tests again since they are mandatory and toggle is not.
