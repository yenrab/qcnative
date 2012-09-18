//
//  CheckUrlValCO.m
//  QC_WAIT Example
//
//  Created by Lee Barney on 9/18/12.
//  Copyright (c) 2012 Lee Barney. All rights reserved.
//

#import "CheckUrlValCO.h"

@implementation CheckUrlValCO
//override handleIt
+(QCReturnValue)handleIt:(NSMutableDictionary *)parameters{
    UITextView *theURLInput = [parameters objectForKey:@"url"];
    NSString *theURLString = theURLInput.text;
    if([theURLString length] == 0){
        //handle error
        return QC_STACK_EXIT;
    }
    [parameters setValue:theURLString forKey:@"url string"];
    return QC_STACK_CONTINUE;
}
@end
