//
//  MissingNameECO.m
//  QC Example
//
//  Created by Lee Barney on 3/15/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "MissingValueECO.h"


@implementation MissingValueECO

+ (QCReturnValue) handleIt:(NSMutableDictionary*) parameters{
    UITextView *resultView = [parameters objectForKey:@"resultDisplay"];
    resultView.text = @"You must enter a value in the required field.";
    return QC_STACK_EXIT;
}


@end
