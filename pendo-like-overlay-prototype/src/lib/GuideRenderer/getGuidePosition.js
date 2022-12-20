function getNewElementCoordinates(targetRect, guideRect, direction) {
  const { x, y, bottom, width, top } = targetRect
  const { height, width: guideWidth } = guideRect
  if (direction === 'bottom') {
    return {
      x: x + 16,
      y: bottom + 16,
    }
  }
  if (direction === 'top') {
    return {
      x: x + 16,
      y: top - height - 16,
    }
  }

  if (direction === 'right') {
    return {
      x: x + width + 16,
      y,
    }
  }

  if (direction === 'left') {
    return {
      x: x - guideWidth - 16,
      y,
    }
  }
}

/**
 * Calculate new screen based position
 * @param {DOMRect} guideRect
 * @param {string} direction
 */
function getScreenPosition(guideRect, direction) {
  const { height, width } = document.body.getBoundingClientRect()
  const { width: guideWidth, height: guideHeight } = guideRect
  const horizontalCenter = width / 2 - guideWidth / 2
  const verticalCenter = height / 2 - guideHeight / 2
  if (direction === 'top' || direction === 'bottom') {
    return {
      y: direction === 'top' ? 16 : height - guideHeight - 16,
      x: horizontalCenter,
    }
  }

  if (direction === 'left' || direction === 'right') {
    return {
      y: verticalCenter,
      x: direction === 'left' ? 16 : width - guideWidth - 16,
    }
  }

  if (direction === 'center') {
    return {
      y: verticalCenter,
      x: horizontalCenter,
    }
  }
}

function getGuidePosition(targetElement, guideElement, positionConfig) {
  const guideRect = guideElement.getBoundingClientRect()
  if (positionConfig.type === 'element') {
    const targetRect = targetElement.getBoundingClientRect()
    return getNewElementCoordinates(
      targetRect,
      guideRect,
      positionConfig.direction
    )
  }

  if (positionConfig.type === 'screen') {
    return getScreenPosition(guideRect, positionConfig.direction)
  }
}

export default getGuidePosition
