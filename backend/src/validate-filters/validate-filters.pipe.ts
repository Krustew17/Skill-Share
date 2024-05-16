import { parse } from 'path';
import { filtersDto } from '../jobs/dto/filters.dto';

import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateFiltersPipe implements PipeTransform {
  transform(value: filtersDto, metadata: ArgumentMetadata) {
    console.log('inside validateFiltersPipe');
    console.log(value.pay, metadata);

    const parsePayToInt = parseInt(value.pay.toString());

    if (isNaN(parsePayToInt)) {
      throw new HttpException('Invalid pay value', HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
