/* eslint-env jest */
import React from 'react'
import renderer from 'react-test-renderer'
import { matcher, serializer } from 'jest-glamor-react'
import { sheet, css, flush } from '../src/index'

expect.addSnapshotSerializer(serializer(sheet))
expect.extend(matcher)

describe('css', () => {
  test('handles more than 10 dynamic properties', () => {
    const cls1 = css`
      text-decoration: ${'underline'};
      border-right: solid blue 54px;
      background: ${'white'};
      color: ${'black'};
      display: ${'block'};
      border-radius: ${'3px'};
      padding: ${'25px'};
      width: ${'500px'};
      z-index: ${100};
      font-size: ${'18px'};
      text-align: ${'center'};
    `

    const tree = renderer.create(<div className={cls1} />).toJSON()
    expect(tree).toMatchSnapshotWithGlamor()
  })

  test('composes with undefined values', () => {
    const cls2 = css`
      composes: ${undefined};
      justifyContent: center;
    `
    const tree = renderer.create(<div className={cls2} />).toJSON()
    expect(tree).toMatchSnapshotWithGlamor()
  })

  test('composes', () => {
    const cls1 = css`
      display: flex;
    `
    const cls2 = css`
      composes: ${cls1};
      justifyContent: center;
    `
    const tree = renderer.create(<div className={cls2} />).toJSON()
    expect(tree).toMatchSnapshotWithGlamor()
  })

  test('handles objects', () => {
    const cls1 = css({
      display: 'flex',
      color: `${'blue'}`,
      fontSize: `${'20px'}`,
      height: `${50}`,
      width: 20
    })
    const tree = renderer.create(<div className={cls1} />).toJSON()
    expect(tree).toMatchSnapshotWithGlamor()
  })

  test('computed key is only dynamic', () => {
    const cls1 = css({
      fontSize: 10,
      [`w${'idth'}`]: 20
    })
    const tree = renderer.create(<div className={cls1} />).toJSON()
    expect(tree).toMatchSnapshotWithGlamor()
  })

  test('composes with objects', () => {
    const cls1 = css({
      display: ['flex', 'block'],
      width: 30,
      height: 'calc(40vw - 50px)',
      ':hover': { color: 'blue' },
      ':after': {
        content: '" "',
        color: 'red'
      },
      '@media(min-width: 420px)': {
        color: 'green'
      }
    })
    const cls2 = css`
      composes: ${cls1};
      justifyContent: center;
    `

    const tree = renderer.create(<div className={cls2} />).toJSON()
    expect(tree).toMatchSnapshotWithGlamor()
  })
  test('null rule', () => {
    const cls1 = css()

    const tree = renderer.create(<div className={cls1} />).toJSON()
    expect(tree).toMatchSnapshotWithGlamor()
  })
  test('flushes correctly', () => {
    const cls1 = css`
    display: flex;
  `
    const tree = renderer.create(<div className={cls1} />).toJSON()
    expect(tree).toMatchSnapshotWithGlamor()
    flush()
    const tree2 = renderer.create(<div className={cls1} />).toJSON()
    expect(tree2).toMatchSnapshotWithGlamor()
  })
})