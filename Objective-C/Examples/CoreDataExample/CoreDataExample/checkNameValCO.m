//
//  checkNameValCO.m
//  QC Example
//
//  Created by Lee Barney on 3/15/11.
//

#import "CheckNameValCO.h"
#import "ControlObjectStack.h"

@implementation CheckNameValCO

+ (QCReturnValue) handleIt:(NSMutableDictionary*) parameters{
    NSString *aName = [parameters objectForKey:@"name"];
    aName = [aName stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    if ([aName length] > 0) {
        return QC_STACK_CONTINUE;
    }
    //an example of how to handle a validation failure
    ControlObjectStack *theStack = [parameters objectForKey:@"co_stack"];
    [theStack dispatchToECO:@"missingValue" withParameters:parameters];
    return QC_STACK_EXIT;
}

@end
