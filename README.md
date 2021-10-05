## How words are structured

- Words are at most 4 units tall
- x position in column starts at 0
- if letter has an up tail, move x one to the direction of the tail
- if letter has a down tail, mark for next letter
  - if marked move x one away from the direction of the tail
  - if marked and current letter is an up tail on same side, go to next column


### Types:
- 1 units
  - a, b, c, d, e, f, g, h, i
- down right
  - j, q, s, z
- down left
  - k, p, t, y, m, v
- up left
  - r, n, w
- up right
  - l, u, o, x
