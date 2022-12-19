function getNewElementCoordinates(targetRect, guideRect, direction) {
  const {x, y, bottom, width, top} = targetRect
  const { height, width: guideWidth } = guideRect
  if(direction === 'bottom') {
    return {
      x: x + 16,
      y: bottom + 16}
  }
  if(direction === 'top') {
    return {
      x: x + 16,
      y: top - height - 16
    }
  }

  if(direction === 'right') {
    return {
      x: x + width + 16,
      y
    }
  }

  if(direction === 'left') {
    return {
      x: x - guideWidth - 16,
      y
    }
  }
}

function getGuidePosition(targetElement, guideElement, positionConfig) {
  if(positionConfig.type === 'element') {
    const targetRect = targetElement.getBoundingClientRect()
    const guideRect = guideElement.getBoundingClientRect()
    return getNewElementCoordinates(targetRect, guideRect, positionConfig.direction)
  }
}

export default getGuidePosition;
