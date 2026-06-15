import ASSET_PATHS from '../util/paths.js';
import * as basicShape from './basicShapes.js';
import { getMaterial } from '../util/TextureLoader.js';
/**
 * Baseplate
 */

export function getBasePlate() {
    // getCube(width,height,depth,map,heightMap,normalMap,roughness,metalness,castShadow,receiveShadow
    return basicShape.getCube(
        80,
        0.8,
        50,
        getMaterial(ASSET_PATHS.FLOOR_DIFF),
        getMaterial(ASSET_PATHS.FLOOR_DISP),
        getMaterial(ASSET_PATHS.FLOOR_NORM),
        getMaterial(ASSET_PATHS.FLOOR_NORM),
        0.1,
        true,
        true
    );
}
